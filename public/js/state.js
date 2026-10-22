// ============================================================
// ARCANASTRIDE 3D: SHARED CLIENT STATE & DERIVED STAT ENGINE
// ============================================================

let player = {
  name: "Traveler",
  className: "Chrono Blade",
  heroSkin: "knight",
  level: 1,
  xp: 0,
  xpToNext: 50,
  hp: 150,
  maxHp: 150,
  mp: 60,
  maxMp: 60,
  atk: 16,
  def: 8,
  str: 10,
  dex: 10,
  vit: 10,
  int: 10,
  statPoints: 5,
  skillPoints: 2,
  gold: 100,
  potions: 5,
  ethers: 3,
  elixirs: 2,
  chaosOrbs: 3,
  floor: 1,
  x: 0,
  z: 18,
  skills: {
    slash: 1,
    whirlwind: 1,
    aether_bolt: 1,
    aegis_slam: 1,
    crimson_fury: 1,
    holy_nova: 1,
    phantom_dash: 1
  },
  actionBar: [
    'slash',
    'whirlwind',
    'aether_bolt',
    'aegis_slam',
    'crimson_fury',
    'holy_nova',
    'phantom_dash',
    'potion',
    'ether',
    'elixir'
  ],
  keybinds: ['1', '2', '3', '4', '5', '6', 'Q', 'F', 'G', 'R'],
  equipment: {},
  inventory: []
};

const keys = {};
let cameraYaw = 0;
let cameraPitch = 0.42;
let sTurnTargetYaw = null;
let sMovementYaw = null;
let isPointerDown = false;
let lastAttackTime = 0;
let lastDashTime = 0;
let attackAnimUntil = 0;
let furyBuffUntil = 0;

let activeZoneId = 'outpost_wilds';
let selectedMapRarity = 'Normal';
let activeMapAffixes = [];
let dungeonKills = 0;
let dungeonBossSpawned = false;

let draggedActionId = null;
let draggedFromSlot = null;
let listeningForSlotKeybind = null;

// Track per-action cooldowns: { [actionId]: { start: number, end: number, duration: number } }
const actionCooldowns = {};

// 3D World Collections & Targeting
let currentTargetEnemy = null;
let targetGroundRing = null;
const enemies = [];
const caches = [];
const particles = [];
const slashWaves = [];
const npcMixers = [];

const clock = new THREE.Clock();
const gltfLoader = new THREE.GLTFLoader();
const MODEL_CACHE = {};

// Computes total attributes, Attack Power, Defense, Crit Chance %, Skill Power %, Max HP & Max MP
function getDerivedStats() {
  const eq = player.equipment || {};
  let gearAtk = 0, gearDef = 0, gearStr = 0, gearDex = 0, gearVit = 0, gearInt = 0;

  Object.values(eq).forEach(item => {
    if (!item) return;
    gearAtk += (item.atk || 0);
    gearDef += (item.def || 0);
    gearStr += (item.str || 0);
    gearDex += (item.dex || 0);
    gearVit += (item.vit || 0);
    gearInt += (item.int || 0);
  });

  const totalStr = (player.str || 10) + gearStr;
  const totalDex = (player.dex || 10) + gearDex;
  const totalVit = (player.vit || 10) + gearVit;
  const totalInt = (player.int || 10) + gearInt;

  const isFuryActive = performance.now() < furyBuffUntil;
  const furyAtkMult = isFuryActive ? 1.35 : 1.0;
  const furyCritBonus = isFuryActive ? 20 : 0;

  const rawAtk = (player.atk || 16) + gearAtk + Math.max(0, totalStr - 10) * 2;
  const totalAtk = Math.round(rawAtk * furyAtkMult);
  const totalDef = (player.def || 8) + gearDef + Math.max(0, totalDex - 10) * 1;
  const critChance = Math.min(85, Math.round(10 + totalDex * 1.2 + furyCritBonus));
  const spellPowerPct = Math.round(totalInt * 2.5);

  const calcMaxHp = (player.maxHp || 150) + Math.max(0, totalVit - 10) * 15;
  const calcMaxMp = (player.maxMp || 60) + Math.max(0, totalInt - 10) * 10;

  return {
    totalStr,
    totalDex,
    totalVit,
    totalInt,
    gearStr,
    gearDex,
    gearVit,
    gearInt,
    totalAtk,
    totalDef,
    critChance,
    spellPowerPct,
    calcMaxHp,
    calcMaxMp,
    isFuryActive
  };
}
