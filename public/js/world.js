// ============================================================
// ARCANASTRIDE 3D: OPEN WORLD STRUCTURES, PROPS, ENEMIES & LOOT CHESTS
// ============================================================

// 1. Sanctuary Healing Shrine (-10, 0, -4)
const sanctuaryPos = new THREE.Vector3(-10, 0, -4);
const crystalGeo = new THREE.OctahedronGeometry(1.3, 0);
const crystalMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.85 });
const sanctuaryMesh = new THREE.Mesh(crystalGeo, crystalMat);
sanctuaryMesh.position.set(sanctuaryPos.x, 2.6, sanctuaryPos.z);
scene.add(sanctuaryMesh);

const sanctuaryLight = new THREE.PointLight(0x10b981, 2.4, 24);
sanctuaryLight.position.set(sanctuaryPos.x, 4.5, sanctuaryPos.z);
scene.add(sanctuaryLight);

const sanctuaryBanner = createBannerSprite('SANCTUARY SHRINE', '[E] Heal HP & MP (15g)', '#34d399', '💚', 6.0, 1.8);
sanctuaryBanner.position.set(sanctuaryPos.x, 6.2, sanctuaryPos.z);
scene.add(sanctuaryBanner);

// 2. Quartermaster Merchant Market Stand & Animated 3D NPC (10, 0, -4)
const shopPos = new THREE.Vector3(10, 0, -4);
const shopLight = new THREE.PointLight(0xf59e0b, 2.2, 22);
shopLight.position.set(shopPos.x, 4.5, shopPos.z);
scene.add(shopLight);

const shopBanner = createBannerSprite('QUARTERMASTER SHOP', '[E] Buy Gear & Potions', '#fbbf24', '🪙', 6.2, 1.8);
shopBanner.position.set(shopPos.x, 6.2, shopPos.z);
scene.add(shopBanner);

// 3. Boss Portal Gate (North at 0, -58)
const bossGatePos = new THREE.Vector3(0, 0, -58);
const torusGeo = new THREE.TorusGeometry(4.2, 0.45, 16, 48);
const torusMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xe11d48, emissiveIntensity: 0.95 });
const bossGateMesh = new THREE.Mesh(torusGeo, torusMat);
bossGateMesh.position.set(bossGatePos.x, 4.8, bossGatePos.z);
scene.add(bossGateMesh);

const bossGateLight = new THREE.PointLight(0xf43f5e, 3.0, 32);
bossGateLight.position.set(bossGatePos.x, 6, bossGatePos.z + 2);
scene.add(bossGateLight);

const bossBanner = createBannerSprite('VOID CITADEL GATE', '[E] Summon Boss Vaelen', '#fb7185', '💀', 6.8, 1.9);
bossBanner.position.set(bossGatePos.x, 10.5, bossGatePos.z);
scene.add(bossBanner);

// 3D Environment Props: Trees, Ancient Columns, Rocks & Aether Crystals
const obstacles = [];
for (let i = 0; i < 75; i++) {
  const angle = (i / 75) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
  const radius = 19 + Math.random() * 115;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  if (Math.abs(x) < 6.5 && z < 22 && z > -68) continue;

  const propType = i % 4;
  obstacles.push({ x, z, r: 1.8, propType, rot: Math.random() * Math.PI * 2, scale: 0.85 + Math.random() * 0.55 });
}

function populateEnvironmentProps(propType, gltf, baseHeight, emissiveHex = null) {
  obstacles.filter(o => o.propType === propType).forEach(o => {
    const clone = gltf.scene.clone();
    fitModelToHeight(clone, baseHeight * o.scale, 0);
    clone.position.x = o.x;
    clone.position.z = o.z;
    clone.rotation.y = o.rot;
    tintModelMaterials(clone, emissiveHex, emissiveHex ? 0.35 : 0);
    scene.add(clone);
  });
}

function preloadWorldAndEnemyModels() {
  // Load Outpost structures & NPC
  gltfLoader.load(GLB_URLS.sanctuary, (gltf) => {
    const shrine = gltf.scene;
    fitModelToHeight(shrine, 4.8, 0);
    shrine.position.x = sanctuaryPos.x;
    shrine.position.z = sanctuaryPos.z;
    tintModelMaterials(shrine, 0x065f46, 0.15);
    scene.add(shrine);
  });

  gltfLoader.load(GLB_URLS.shop, (gltf) => {
    const stall = gltf.scene;
    fitModelToHeight(stall, 4.2, 0);
    stall.position.x = shopPos.x;
    stall.position.z = shopPos.z;
    tintModelMaterials(stall);
    scene.add(stall);
  });

  gltfLoader.load(GLB_URLS.mage, (gltf) => {
    MODEL_CACHE.hero_mage = gltf;
    const npc = THREE.SkeletonUtils.clone(gltf.scene);
    npc.scale.set(1.3, 1.3, 1.3);
    npc.position.set(shopPos.x - 2.2, 0, shopPos.z + 1.8);
    npc.rotation.y = -Math.PI / 6;
    configureHeroEquipment(npc, 'mage');
    scene.add(npc);
    const mixer = new THREE.AnimationMixer(npc);
    const idleClip = gltf.animations.find(a => a.name === 'Idle') || gltf.animations[0];
    if (idleClip) mixer.clipAction(idleClip).play();
    npcMixers.push(mixer);
  });

  gltfLoader.load(GLB_URLS.arch, (gltf) => {
    const arch = gltf.scene;
    fitModelToHeight(arch, 9.2, 0);
    arch.position.x = bossGatePos.x;
    arch.position.z = bossGatePos.z;
    tintModelMaterials(arch, 0x881337, 0.2);
    scene.add(arch);
  });

  // Load Enemy & Chest GLBs
  ['robot', 'flier', 'wasp', 'spider', 'skeletonWarrior', 'skeletonMage', 'sword', 'crystal'].forEach(key => {
    gltfLoader.load(GLB_URLS[key], (gltf) => {
      MODEL_CACHE[key] = gltf;
      if (key === 'crystal') populateEnvironmentProps(3, gltf, 3.2, 0x38bdf8);
      enemies.forEach(e => attachEnemyGLB(e));
    });
  });

  gltfLoader.load(GLB_URLS.chest, (gltf) => {
    MODEL_CACHE.chest = gltf;
    caches.forEach(c => attachChestGLB(c));
  });

  gltfLoader.load(GLB_URLS.tree, (gltf) => populateEnvironmentProps(0, gltf, 6.5));
  gltfLoader.load(GLB_URLS.column, (gltf) => populateEnvironmentProps(1, gltf, 5.8));
  gltfLoader.load(GLB_URLS.rock, (gltf) => populateEnvironmentProps(2, gltf, 2.4));
}

function attachEnemyGLB(e) {
  if (e.hasGLB) return;

  let sourceKey = e.forcedModel || 'robot';
  if (!e.forcedModel) {
    if (e.name.includes("Stalker") || e.name.includes("Swarmer")) {
      sourceKey = MODEL_CACHE.wasp ? 'wasp' : (MODEL_CACHE.flier ? 'flier' : null);
    } else if (e.name.includes("Automaton") || e.name.includes("Construct")) {
      sourceKey = MODEL_CACHE.robot ? 'robot' : null;
    } else if (e.name.includes("Corruptor") || e.name.includes("Necromancer") || e.name.includes("Lich")) {
      sourceKey = MODEL_CACHE.skeletonMage ? 'skeletonMage' : (MODEL_CACHE.spider ? 'spider' : null);
    } else if (e.name.includes("Arachnid") || e.name.includes("Spider") || e.name.includes("Arachneia")) {
      sourceKey = MODEL_CACHE.spider ? 'spider' : null;
    } else if (e.name.includes("Golem") || e.isBoss) {
      sourceKey = MODEL_CACHE.skeletonWarrior ? 'skeletonWarrior' : (MODEL_CACHE.robot ? 'robot' : null);
    }
  } else if (!MODEL_CACHE[sourceKey]) {
    sourceKey = null;
  }

  const source = sourceKey ? MODEL_CACHE[sourceKey] : null;
  if (!source) return;

  e.hasGLB = true;
  e.mesh.visible = false;

  const clonedScene = sourceKey === 'flier'
    ? source.scene.clone()
    : THREE.SkeletonUtils.clone(source.scene);

  if (sourceKey === 'flier') {
    const s = 0.035 * e.scale;
    clonedScene.scale.set(s, s, s);
    clonedScene.position.y = 2.4;
  } else if (sourceKey === 'wasp') {
    const s = 0.72 * e.scale;
    clonedScene.scale.set(s, s, s);
    clonedScene.position.y = 1.4;
  } else if (sourceKey === 'spider') {
    const s = 0.85 * e.scale;
    clonedScene.scale.set(s, s, s);
  } else if (sourceKey === 'skeletonWarrior' || sourceKey === 'skeletonMage') {
    const s = 1.25 * e.scale;
    clonedScene.scale.set(s, s, s);
    const weaponSource = sourceKey === 'skeletonWarrior' ? MODEL_CACHE.sword : MODEL_CACHE.crystal;
    if (weaponSource) {
      clonedScene.traverse(node => {
        if (node.name === 'handslot.r') {
          const w = weaponSource.scene.clone();
          w.scale.set(0.7, 0.7, 0.7);
          node.add(w);
        }
      });
    }
  } else {
    const s = 0.62 * e.scale;
    clonedScene.scale.set(s, s, s);
  }

  tintModelMaterials(clonedScene, e.isBoss ? 0xe11d48 : null, e.isBoss ? 0.45 : 0);

  e.group.add(clonedScene);
  e.mixer = new THREE.AnimationMixer(clonedScene);
  e.sourceKey = sourceKey;

  const anims = source.animations || [];
  const idleClip = anims.find(a => /idle|standing/i.test(a.name));
  const walkClip = anims.find(a => /walk|run|fly/i.test(a.name)) || anims[0];
  const atkClip = anims.find(a => /attack|chop|slice|punch|shoot|spin/i.test(a.name));

  if (idleClip) {
    e.idleAction = e.mixer.clipAction(idleClip);
  }
  if (walkClip) {
    e.walkAction = e.mixer.clipAction(walkClip);
  }
  if (atkClip) {
    e.punchAction = e.mixer.clipAction(atkClip);
  }

  // Start in Idle pose when standing still at spawn
  setEnemyAnim(e, 'idle');
}

function setEnemyAnim(e, state, oneShotMs = 0) {
  if (!e.mixer) return;
  const now = performance.now();
  if (oneShotMs === 0 && e.attackAnimUntil && now < e.attackAnimUntil) return;

  let nextAction = null;
  if (state === 'attack' && e.punchAction) {
    nextAction = e.punchAction;
  } else if (state === 'walk' && e.walkAction) {
    nextAction = e.walkAction;
  } else if (state === 'idle') {
    nextAction = e.idleAction || e.walkAction;
  }

  if (!nextAction) return;

  // If a flying creature (wasp/parrot) has no separate idle clip, slow wingbeat while hovering idle
  if (state === 'idle' && !e.idleAction && e.walkAction) {
    e.walkAction.timeScale = (e.sourceKey === 'wasp' || e.sourceKey === 'flier') ? 0.55 : 0.0;
  } else if (nextAction === e.walkAction) {
    e.walkAction.timeScale = 1.0;
  }

  if (e.activeAction === nextAction && oneShotMs === 0) return;

  if (e.activeAction && e.activeAction !== nextAction) {
    e.activeAction.fadeOut(0.18);
  }
  nextAction.reset().fadeIn(0.18).play();
  e.activeAction = nextAction;

  if (oneShotMs > 0) {
    e.attackAnimUntil = now + oneShotMs;
  }
}

function spawnEnemy(isBoss = false, indexHint = -1) {
  const zone = typeof getActiveZoneConfig === 'function' ? getActiveZoneConfig() : DUNGEON_ZONES[0];
  const modSummary = typeof getMapModifiersSummary === 'function'
    ? getMapModifiersSummary()
    : { dmgMult: 1, hpMult: 1, packMult: 1, speedMult: 1, quantBonus: 0 };

  const tierScale = zone.monsterMult * (1 + ((player.floor || 1) - 1) * 0.12);
  const rewardMult = tierScale * (1 + (modSummary.quantBonus || 0) / 100);
  let template;
  let x, z;
  let forcedModel = null;

  if (isBoss) {
    template = {
      name: zone.bossName || "Vaelen, Void Architect",
      icon: "👑",
      color: 0xf43f5e,
      hp: zone.bossHp || 420,
      atk: zone.bossAtk || 36,
      def: zone.bossDef || 14,
      xp: Math.round(650 * zone.monsterMult),
      gold: Math.round(380 * zone.monsterMult),
      scale: zone.bossScale || 2.1
    };
    forcedModel = zone.bossModel || 'skeletonWarrior';
    const nearGate = playerGroup.position.distanceTo(bossGatePos) < 22;
    x = (nearGate ? bossGatePos.x : playerGroup.position.x) + (Math.random() - 0.5) * 10;
    z = (nearGate ? bossGatePos.z + 7 : playerGroup.position.z - 12);
  } else {
    template = ENEMY_TYPES[(indexHint >= 0 ? indexHint : Math.floor(Math.random() * ENEMY_TYPES.length)) % ENEMY_TYPES.length];
    let foundPos = false;
    for (let attempt = 0; attempt < 30; attempt++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = indexHint >= 0 && indexHint < 8
        ? 16 + Math.random() * 24
        : 22 + Math.random() * 65;
      const candX = Math.cos(angle) * dist;
      let candZ = Math.sin(angle) * dist - 8;
      if (Math.hypot(candX, candZ - 12) < 12) {
        candZ += (candZ >= 12 ? 14 : -14);
      }

      // Check distance against existing enemies to avoid spawn stacking
      let tooClose = false;
      for (let j = 0; j < enemies.length; j++) {
        const other = enemies[j];
        const dx = other.group.position.x - candX;
        const dz = other.group.position.z - candZ;
        if (dx * dx + dz * dz < 4.5 * 4.5) {
          tooClose = true;
          break;
        }
      }
      if (!tooClose || attempt === 29) {
        x = candX;
        z = candZ;
        foundPos = true;
        break;
      }
    }
    if (!foundPos) {
      x = 20 + Math.random() * 15;
      z = 20 + Math.random() * 15;
    }
  }

  const group = new THREE.Group();
  const geo = isBoss
    ? new THREE.DodecahedronGeometry(1.2 * template.scale)
    : new THREE.BoxGeometry(1.2 * template.scale, 1.8 * template.scale, 1.2 * template.scale);
  const mat = new THREE.MeshStandardMaterial({
    color: template.color,
    emissive: template.color,
    emissiveIntensity: 0.35,
    roughness: 0.4
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = 1.1 * template.scale;
  mesh.castShadow = true;
  group.add(mesh);

  const labelSprite = createBannerSprite(
    template.name.toUpperCase(),
    isBoss ? `★ TIER ${zone.tier} BOSS ★` : `Tier ${zone.tier} • ${selectedMapRarity}`,
    isBoss ? '#fb7185' : (zone.borderColor || '#94a3b8'),
    template.icon || '⚔️',
    isBoss ? 5.4 : 3.7,
    isBoss ? 1.5 : 1.08
  );
  const barHeight = (isBoss ? 3.2 : 2.6) * template.scale + 0.8;
  labelSprite.position.y = barHeight + 0.75;
  group.add(labelSprite);

  const hpBgGeo = new THREE.PlaneGeometry(2.4, 0.28);
  const hpBgMat = new THREE.MeshBasicMaterial({ color: 0x0f172a, side: THREE.DoubleSide });
  const hpBg = new THREE.Mesh(hpBgGeo, hpBgMat);
  hpBg.position.y = barHeight;
  group.add(hpBg);

  const hpFgGeo = new THREE.PlaneGeometry(2.3, 0.2);
  const hpFgMat = new THREE.MeshBasicMaterial({ color: isBoss ? 0xf43f5e : 0x22c55e, side: THREE.DoubleSide });
  const hpFg = new THREE.Mesh(hpFgGeo, hpFgMat);
  hpFg.position.y = barHeight + 0.01;
  group.add(hpFg);

  group.position.set(x, 0, z);
  scene.add(group);

  const finalHp = Math.round(template.hp * (isBoss ? 1 : tierScale) * modSummary.hpMult);
  const finalAtk = Math.round(template.atk * (isBoss ? 1 : tierScale) * modSummary.dmgMult);

  const enemyObj = {
    isBoss,
    forcedModel,
    name: template.name,
    icon: template.icon || '⚔️',
    radius: (template.scale || 1) * (isBoss ? 1.9 : 1.25),
    maxHp: finalHp,
    hp: finalHp,
    atk: finalAtk,
    def: Math.round(template.def * (isBoss ? 1 : tierScale)),
    xp: Math.round(template.xp * (isBoss ? (1 + modSummary.quantBonus / 100) : rewardMult)),
    gold: Math.round(template.gold * (isBoss ? (1 + modSummary.quantBonus / 100) : rewardMult)),
    speedMult: modSummary.speedMult || 1.0,
    scale: template.scale,
    group,
    mesh,
    hpBg,
    hpFg,
    lastHitPlayer: 0,
    mixer: null,
    hasGLB: false
  };
  attachEnemyGLB(enemyObj);
  enemies.push(enemyObj);
}

function attachChestGLB(cacheObj) {
  if (cacheObj.hasGLB || !MODEL_CACHE.chest) return;
  cacheObj.hasGLB = true;
  cacheObj.fallbackMesh.visible = false;
  const chest = MODEL_CACHE.chest.scene.clone();
  fitModelToHeight(chest, 1.45, 0);
  tintModelMaterials(chest, 0xb45309, 0.2);
  cacheObj.group.add(chest);
}

function spawnCache() {
  const angle = Math.random() * Math.PI * 2;
  const dist = 15 + Math.random() * 70;
  const x = Math.cos(angle) * dist;
  const z = Math.sin(angle) * dist - 5;

  const group = new THREE.Group();
  group.position.set(x, 0, z);

  const geo = new THREE.BoxGeometry(1.3, 1.1, 1.3);
  const mat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.6 });
  const fallbackMesh = new THREE.Mesh(geo, mat);
  fallbackMesh.position.y = 0.55;
  group.add(fallbackMesh);

  const iconSprite = createIconSprite('💰', '#facc15', 1.55);
  iconSprite.position.y = 2.4;
  group.add(iconSprite);

  scene.add(group);
  const cacheObj = { group, mesh: group, fallbackMesh, iconSprite, x, z, hasGLB: false };
  attachChestGLB(cacheObj);
  caches.push(cacheObj);
}

function populateWorld() {
  enemies.forEach(e => scene.remove(e.group));
  caches.forEach(c => scene.remove(c.group));
  enemies.length = 0;
  caches.length = 0;

  const zone = typeof getActiveZoneConfig === 'function' ? getActiveZoneConfig() : DUNGEON_ZONES[0];
  const modSummary = typeof getMapModifiersSummary === 'function' ? getMapModifiersSummary() : { packMult: 1 };
  const totalEnemies = Math.round((zone.packCount || 26) * (modSummary.packMult || 1));

  for (let i = 0; i < totalEnemies; i++) spawnEnemy(false, i);
  for (let i = 0; i < 12; i++) spawnCache();
}
