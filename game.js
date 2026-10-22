#!/usr/bin/env node

const http = require('http');
const next = require('next');
const { createGameServer } = require('./server/httpServer');
const { SAVE_FILE } = require('./server/saveManager');

const PORT = parseInt(process.env.PORT, 10) || 8080;
const dev = process.env.NODE_ENV !== 'production';

// Attempt to start Next.js application server
try {
  const app = next({ dev, dir: __dirname });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    const server = http.createServer((req, res) => {
      handle(req, res);
    });

    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`\x1b[36m\x1b[1m============================================================\x1b[0m`);
      console.log(`\x1b[35m\x1b[1m   ARCANASTRIDE 3D: NEXT.JS MMORPG SERVER (PORT ${PORT})   \x1b[0m`);
      console.log(`\x1b[36m\x1b[1m============================================================\x1b[0m`);
      console.log(`1. Landing Screen:  \x1b[32mhttp://localhost:${PORT}/\x1b[0m`);
      console.log(`2. MMORPG Realm:    \x1b[32mhttp://localhost:${PORT}/realm\x1b[0m`);
      console.log(`3. Save file:       \x1b[36m${SAVE_FILE}\x1b[0m`);
    });
  }).catch(err => {
    console.error("Next.js prepare error, falling back to standalone HTTP server:", err);
    startFallbackServer();
  });
} catch (e) {
  console.error("Next.js load error, falling back to standalone HTTP server:", e);
  startFallbackServer();
}

function startFallbackServer() {
  const fallback = createGameServer();
  fallback.listen(PORT, () => {
    console.log(`Arcanastride standalone server running on port ${PORT}`);
  });
}