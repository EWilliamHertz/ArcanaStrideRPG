// ============================================================
// ARCANASTRIDE 3D: HERO 3D MODEL, ANIMATION MIXER & ARCHETYPES
// ============================================================

const playerGroup = new THREE.Group();
playerGroup.rotation.y = Math.PI; // Face North (-Z) towards Outpost & Boss Gate

// Visible Armored Hero Fallback Mesh (shown for <0.5s while GLB loads so hero is never missing)
const fallbackHeroGroup = new THREE.Group();
const fbTorso = new THREE.Mesh(
  new THREE.BoxGeometry(0.95, 1.35, 0.6),
  new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.6, roughness: 0.3 })
);
fbTorso.position.y = 1.15;
fallbackHeroGroup.add(fbTorso);

const fbHelm = new THREE.Mesh(
  new THREE.SphereGeometry(0.42, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.7, roughness: 0.25 })
);
fbHelm.position.y = 2.15;
fallbackHeroGroup.add(fbHelm);
playerGroup.add(fallbackHeroGroup);

const playerHead = new THREE.Object3D();
playerHead.position.y = 2.75;
playerGroup.add(playerHead);

// Hero Aura Ring on Ground
const heroRingGeo = new THREE.RingGeometry(0.85, 1.15, 32);
const heroRingMat = new THREE.MeshBasicMaterial({
  color: 0x22d3ee,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.65
});
const heroRing = new THREE.Mesh(heroRingGeo, heroRingMat);
heroRing.rotation.x = -Math.PI / 2;
heroRing.position.y = 0.06;
playerGroup.add(heroRing);

// Auxiliary Floating Aether Blade (for Soldier rig & slash visual)
const swordGeo = new THREE.BoxGeometry(0.14, 2.1, 0.24);
const swordMat = new THREE.MeshStandardMaterial({
  color: 0xe879f9,
  emissive: 0xc026d3,
  emissiveIntensity: 0.9
});
const swordMesh = new THREE.Mesh(swordGeo, swordMat);
swordMesh.position.set(-0.9, 1.5, 0.45);
swordMesh.rotation.x = Math.PI / 4;
swordMesh.visible = false;
playerGroup.add(swordMesh);

scene.add(playerGroup);

let playerMixer = null;
let playerActions = {};
let activePlayerAction = null;
let currentHeroModel = null;
let currentHeroSkin = null;
let requestedHeroSkin = null;

function resolveHeroAnimName(logicalName) {
  const map = {
    'Idle': ['Idle', '2H_Melee_Idle', 'idle'],
    'Run': ['Running_A', 'Run', 'Running', 'Walking_A', 'Walk'],
    'Attack': ['1H_Melee_Attack_Slice_Horizontal', '1H_Melee_Attack_Chop', '2H_Melee_Attack_Slice', 'Punch', 'Run'],
    'Chop': ['1H_Melee_Attack_Chop', '1H_Melee_Attack_Slice_Horizontal', 'Punch', 'Run'],
    'Skill': ['2H_Melee_Attack_Spin', 'Spellcast_Shoot', '1H_Melee_Attack_Chop', 'Run'],
    'Cast': ['Spellcast_Shoot', '2H_Melee_Attack_Spin', 'Use_Item', 'Run'],
    'Dash': ['Dodge_Forward', 'Running_A', 'Run'],
    'Use': ['Use_Item', 'Cheer', 'Idle']
  };
  const candidates = map[logicalName] || [logicalName];
  for (const c of candidates) {
    if (playerActions[c]) return c;
  }
  return Object.keys(playerActions)[0] || null;
}

function setPlayerAnim(logicalName, oneShotDuration = 0) {
  const now = performance.now();
  if (oneShotDuration === 0 && now < attackAnimUntil) return;
  const clipName = resolveHeroAnimName(logicalName);
  if (!clipName || !playerActions[clipName]) return;
  const nextAction = playerActions[clipName];
  if (activePlayerAction === nextAction && oneShotDuration === 0) return;

  if (activePlayerAction && activePlayerAction !== nextAction) {
    activePlayerAction.fadeOut(0.15);
  }
  nextAction.reset().fadeIn(0.15).play();
  activePlayerAction = nextAction;
  if (oneShotDuration > 0) {
    attackAnimUntil = now + oneShotDuration;
  }
}

function configureHeroEquipment(model, skinType) {
  const hideList = new Set([
    '1H_Sword_Offhand', 'Rectangle_Shield', 'Round_Shield'
  ]);
  if (skinType === 'knight') {
    hideList.add('Spike_Shield');
    hideList.add('1H_Sword');
  } else if (skinType === 'vanguard') {
    hideList.add('Badge_Shield');
    hideList.add('2H_Sword');
  } else if (skinType === 'mage') {
    hideList.add('Spellbook');
    hideList.add('1H_Wand');
  }
  model.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.frustumCulled = false;
    }
    if (hideList.has(child.name)) {
      child.visible = false;
    }
  });
}

function attachHeroGLTF(gltf, skinType) {
  if (requestedHeroSkin && requestedHeroSkin !== skinType) return;
  if (currentHeroModel) {
    playerGroup.remove(currentHeroModel);
  }
  const model = THREE.SkeletonUtils.clone(gltf.scene);
  currentHeroModel = model;
  currentHeroSkin = skinType;
  fallbackHeroGroup.visible = false;

  if (skinType === 'soldier') {
    model.scale.set(1.75, 1.75, 1.75);
    model.rotation.y = Math.PI;
    swordMesh.visible = true;
  } else {
    model.scale.set(1.35, 1.35, 1.35);
    model.rotation.y = 0;
    swordMesh.visible = false;
  }

  configureHeroEquipment(model, skinType);
  playerGroup.add(model);

  playerMixer = new THREE.AnimationMixer(model);
  playerActions = {};
  activePlayerAction = null;
  gltf.animations.forEach(clip => {
    playerActions[clip.name] = playerMixer.clipAction(clip);
  });
  setPlayerAnim('Idle');
}

function loadHeroModel(skinType = 'knight') {
  requestedHeroSkin = skinType;
  const urlKey = skinType === 'mage' ? 'mage' : (skinType === 'soldier' ? 'soldier' : 'knight');
  const cacheKey = `hero_${urlKey}`;

  if (MODEL_CACHE[cacheKey]) {
    attachHeroGLTF(MODEL_CACHE[cacheKey], skinType);
    return;
  }

  gltfLoader.load(GLB_URLS[urlKey], (gltf) => {
    MODEL_CACHE[cacheKey] = gltf;
    attachHeroGLTF(gltf, skinType);
  });
}

function applyArchetypeVisuals(clsName, skinOverride) {
  const skin = skinOverride || (clsName === 'Void Weaver' ? 'mage' : (clsName === 'Aegis Vanguard' ? 'vanguard' : 'knight'));
  player.heroSkin = skin;
  if (clsName === 'Chrono Blade') {
    heroRing.material.color.setHex(0x22d3ee);
    document.getElementById('hud-avatar-icon').src = getRpgIcon('visored-helm');
  } else if (clsName === 'Void Weaver') {
    heroRing.material.color.setHex(0xc084fc);
    document.getElementById('hud-avatar-icon').src = getRpgIcon('wizard-face');
  } else {
    heroRing.material.color.setHex(0xfbbf24);
    document.getElementById('hud-avatar-icon').src = getRpgIcon('spartan-helmet');
  }
  if (currentHeroSkin !== skin || !currentHeroModel) {
    loadHeroModel(skin);
  }
}

function openClassModal() {
  document.getElementById('hero-name-input').value = player.name || 'Traveler';
  document.getElementById('class-modal').classList.remove('hidden');
}

function closeClassModal() {
  document.getElementById('class-modal').classList.add('hidden');
}

function selectArchetype(clsName, skinType) {
  const newName = document.getElementById('hero-name-input').value.trim() || player.name;
  player.name = newName;
  player.className = clsName;
  applyArchetypeVisuals(clsName, skinType);
  closeClassModal();
  addLog(`Switched hero archetype to ${clsName} (${skinType} rig)!`, "text-cyan-300 font-bold");
  updateHUD();
  syncSave();
}
