const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { loadSave, writeSave, resetSave } = require('./saveManager');

const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const ASSETS_DIR = path.join(ROOT_DIR, 'assets');
const NEXT_DIR = path.join(ROOT_DIR, '.next');
const NEXT_STATIC_DIR = path.join(NEXT_DIR, 'static');
const NEXT_LANDING_HTML = path.join(NEXT_DIR, 'server', 'app', 'index.html');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.glb': 'model/gltf-binary',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const GZIP_CACHE = new Map();
const RAW_CACHE = new Map();

function serveCachedFile(req, res, filePath, cacheControl = 'no-cache') {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const stat = fs.statSync(filePath);
  const cacheKey = `${filePath}:${stat.mtimeMs}`;
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const canGzip = /\bgzip\b/.test(acceptEncoding);

  if (canGzip) {
    let gzBuf = GZIP_CACHE.get(cacheKey);
    if (!gzBuf) {
      const raw = fs.readFileSync(filePath);
      gzBuf = zlib.gzipSync(raw);
      GZIP_CACHE.set(cacheKey, gzBuf);
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Encoding': 'gzip',
      'Content-Length': gzBuf.length,
      'Cache-Control': cacheControl
    });
    if (req.method === 'HEAD') return res.end();
    return res.end(gzBuf);
  }

  let rawBuf = RAW_CACHE.get(cacheKey);
  if (!rawBuf) {
    rawBuf = fs.readFileSync(filePath);
    RAW_CACHE.set(cacheKey, rawBuf);
  }
  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': rawBuf.length,
    'Cache-Control': cacheControl
  });
  if (req.method === 'HEAD') return res.end();
  res.end(rawBuf);
}

function createGameServer() {
  return http.createServer((req, res) => {
    const pathname = decodeURIComponent((req.url || '/').split('?')[0]);
    const isGetOrHead = req.method === 'GET' || req.method === 'HEAD';

    // 1. Landing Screen (Next.js prerendered landing page if built, fallback to public/index.html)
    if (isGetOrHead && pathname === '/') {
      if (fs.existsSync(NEXT_LANDING_HTML)) {
        return serveCachedFile(req, res, NEXT_LANDING_HTML, 'no-cache');
      }
      return serveCachedFile(req, res, path.join(PUBLIC_DIR, 'index.html'), 'no-cache');
    }

    // 2. 3D MMORPG Realm Direct Route
    if (isGetOrHead && (pathname === '/realm' || pathname === '/realm.html' || pathname === '/index.html')) {
      const target = fs.existsSync(path.join(PUBLIC_DIR, 'realm.html'))
        ? path.join(PUBLIC_DIR, 'realm.html')
        : path.join(PUBLIC_DIR, 'index.html');
      return serveCachedFile(req, res, target, 'no-cache');
    }

    // 3. Next.js Static Asset Chunks (CSS, JS bundles)
    if (isGetOrHead && pathname.startsWith('/_next/static/')) {
      const relPath = pathname.replace('/_next/static/', '');
      const resolved = path.resolve(NEXT_STATIC_DIR, relPath);
      if (resolved.startsWith(NEXT_STATIC_DIR) && fs.existsSync(resolved)) {
        return serveCachedFile(req, res, resolved, 'public, max-age=31536000, immutable');
      }
    }

    if (isGetOrHead && pathname === '/favicon.ico') {
      res.writeHead(204);
      return res.end();
    }

    // 4. Game State & Save Persistence APIs
    if (isGetOrHead && pathname === '/api/state') {
      const payload = JSON.stringify(loadSave());
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      return res.end(req.method === 'HEAD' ? undefined : payload);
    }

    if (req.method === 'POST' && pathname === '/api/save') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          writeSave(parsed);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: true }));
        } catch (e) {
          res.writeHead(400);
          res.end('Invalid JSON');
        }
      });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/reset') {
      const fresh = resetSave();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(fresh));
    }

    // 5. 3D GLB Models and Static Assets
    if (isGetOrHead && pathname.startsWith('/assets/')) {
      const safeFile = path.basename(pathname);
      const assetPath = path.join(ASSETS_DIR, safeFile);
      return serveCachedFile(req, res, assetPath, 'public, max-age=3600');
    }

    // 6. Public CSS and JavaScript
    if (isGetOrHead && (pathname.startsWith('/css/') || pathname.startsWith('/js/'))) {
      const relPath = pathname.replace(/^\/+/, '');
      const resolved = path.resolve(PUBLIC_DIR, relPath);
      if (resolved.startsWith(PUBLIC_DIR)) {
        return serveCachedFile(req, res, resolved, 'no-cache');
      }
    }

    res.writeHead(404);
    res.end('Not found');
  });
}

module.exports = { createGameServer };
