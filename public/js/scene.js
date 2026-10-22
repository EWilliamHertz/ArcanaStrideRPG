// ============================================================
// ARCANASTRIDE 3D: THREE.JS SCENE, LIGHTING, TERRAIN & SPRITES
// ============================================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x131b38);
scene.fog = new THREE.FogExp2(0x131b38, 0.0032);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 450);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// Rich RPG Lighting
const hemiLight = new THREE.HemisphereLight(0xc7d2fe, 0x1e293b, 1.15);
hemiLight.position.set(0, 80, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xfef3c7, 1.35);
dirLight.position.set(55, 95, 45);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 260;
const shadowBounds = 95;
dirLight.shadow.camera.left = -shadowBounds;
dirLight.shadow.camera.right = shadowBounds;
dirLight.shadow.camera.top = shadowBounds;
dirLight.shadow.camera.bottom = -shadowBounds;
scene.add(dirLight);

// Procedural Fantasy Terrain Texture
function createTerrainTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');

  const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 360);
  grad.addColorStop(0, '#1e3a3a');
  grad.addColorStop(0.5, '#172e36');
  grad.addColorStop(1, '#152238');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 1800; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 1 + Math.random() * 3.5;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(52, 211, 153, 0.14)' : 'rgba(56, 189, 248, 0.10)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 512; i += 64) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(28, 28);
  return tex;
}

const groundGeo = new THREE.PlaneGeometry(500, 500);
const groundMat = new THREE.MeshStandardMaterial({
  map: createTerrainTexture(),
  roughness: 0.88,
  metalness: 0.08
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Outpost Plaza Ring & North Stone Road
const plazaGeo = new THREE.RingGeometry(1.5, 16, 48);
const plazaMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.22 });
const plazaRing = new THREE.Mesh(plazaGeo, plazaMat);
plazaRing.rotation.x = -Math.PI / 2;
plazaRing.position.set(0, 0.04, -4);
scene.add(plazaRing);

const roadGeo = new THREE.PlaneGeometry(5.5, 90);
const roadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 });
const roadMesh = new THREE.Mesh(roadGeo, roadMat);
roadMesh.rotation.x = -Math.PI / 2;
roadMesh.position.set(0, 0.02, -22);
roadMesh.receiveShadow = true;
scene.add(roadMesh);

// 2D Billboard Sprite Factories & 3D Mesh Utilities
function drawCanvasEmblem(ctx, cx, cy, radius, color, labelHint = '') {
  // Glowing emblem disc
  ctx.save();
  ctx.fillStyle = '#090d16';
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const h = String(labelHint).toUpperCase();
  ctx.fillStyle = color;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;

  if (h.includes('💚') || h.includes('HEAL') || h.includes('HP') || color === '#34d399') {
    // Emerald Healing Cross
    ctx.fillRect(cx - radius * 0.22, cy - radius * 0.58, radius * 0.44, radius * 1.16);
    ctx.fillRect(cx - radius * 0.58, cy - radius * 0.22, radius * 1.16, radius * 0.44);
  } else if (h.includes('🪙') || h.includes('💰') || h.includes('GOLD') || color === '#fbbf24' || color === '#facc15') {
    // Golden Coin / Diamond
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.62, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#090d16';
    ctx.font = `900 ${Math.round(radius * 0.9)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', cx, cy + 2);
  } else if (h.includes('👑') || h.includes('💀') || color === '#fb7185') {
    // Boss Crown Emblem
    ctx.beginPath();
    ctx.moveTo(cx - radius * 0.55, cy + radius * 0.4);
    ctx.lineTo(cx - radius * 0.45, cy - radius * 0.35);
    ctx.lineTo(cx - radius * 0.15, cy + radius * 0.05);
    ctx.lineTo(cx, cy - radius * 0.5);
    ctx.lineTo(cx + radius * 0.15, cy + radius * 0.05);
    ctx.lineTo(cx + radius * 0.45, cy - radius * 0.35);
    ctx.lineTo(cx + radius * 0.55, cy + radius * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    // Combat Sword / Rune Diamond
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius * 0.62);
    ctx.lineTo(cx + radius * 0.52, cy);
    ctx.lineTo(cx, cy + radius * 0.62);
    ctx.lineTo(cx - radius * 0.52, cy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function createBannerSprite(title, subtitle, borderColor = '#38bdf8', iconEmoji = '⚔️', scaleX = 5.5, scaleY = 1.65) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(12, 18, 34, 0.92)';
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 6;
  const r = 34;
  ctx.beginPath();
  ctx.moveTo(16 + r, 16);
  ctx.lineTo(496 - r, 16);
  ctx.quadraticCurveTo(496, 16, 496, 16 + r);
  ctx.lineTo(496, 144 - r);
  ctx.quadraticCurveTo(496, 144, 496 - r, 144);
  ctx.lineTo(16 + r, 144);
  ctx.quadraticCurveTo(16, 144, 16, 144 - r);
  ctx.lineTo(16, 16 + r);
  ctx.quadraticCurveTo(16, 16, 16 + r, 16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Draw crisp vector emblem on left side of banner
  drawCanvasEmblem(ctx, 74, 80, 36, borderColor, iconEmoji);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px Inter, sans-serif';
  ctx.fillText(title, 126, 62);

  ctx.fillStyle = borderColor;
  ctx.font = 'bold 23px Inter, sans-serif';
  ctx.fillText(subtitle, 126, 106);

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(scaleX, scaleY, 1);
  sprite.renderOrder = 10;
  return sprite;
}

function createIconSprite(emoji, glowColor = '#facc15', size = 1.6) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 58);
  grad.addColorStop(0, glowColor);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(64, 64, 58, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasEmblem(ctx, 64, 64, 34, glowColor, emoji);

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(size, size, 1);
  return sprite;
}

function fitModelToHeight(obj, targetHeight, yOffset = 0) {
  obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(obj);
  const size = new THREE.Vector3();
  box.getSize(size);
  if (size.y > 0.0001) {
    const ratio = targetHeight / size.y;
    obj.scale.multiplyScalar(ratio);
    obj.updateMatrixWorld(true);
    const box2 = new THREE.Box3().setFromObject(obj);
    obj.position.y += (yOffset - box2.min.y);
  }
}

function tintModelMaterials(root, emissiveHex, intensity = 0.35) {
  root.traverse(child => {
    if (!child.isMesh) return;
    child.castShadow = true;
    child.receiveShadow = true;
    child.frustumCulled = false;
    if (!emissiveHex || !child.material) return;
    const applyTint = (mat) => {
      const cloned = mat.clone();
      if (cloned.emissive) {
        cloned.emissive = new THREE.Color(emissiveHex);
        cloned.emissiveIntensity = intensity;
      }
      return cloned;
    };
    child.material = Array.isArray(child.material)
      ? child.material.map(applyTint)
      : applyTint(child.material);
  });
}
