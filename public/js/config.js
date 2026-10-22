// ============================================================
// ARCANASTRIDE 3D: CONFIGURATION, BUILT-IN SVG ICONS, SKILLS,
// DUNGEONS (WOW + PATH OF EXILE ATLAS) & LOOT TABLES
// ============================================================

const GLB_URLS = {
  knight: '/assets/kaykit_knight.glb',
  mage: '/assets/kaykit_mage.glb',
  soldier: '/assets/soldier.glb',
  skeletonWarrior: '/assets/skeleton_warrior.glb',
  skeletonMage: '/assets/skeleton_mage.glb',
  robot: '/assets/robot.glb',
  spider: '/assets/spider.glb',
  wasp: '/assets/wasp.glb',
  flier: '/assets/parrot.glb',
  chest: '/assets/chest.glb',
  crystal: '/assets/crystal.glb',
  column: '/assets/column.glb',
  arch: '/assets/arch.glb',
  tree: '/assets/tree.glb',
  rock: '/assets/rock.glb',
  shop: '/assets/shop.glb',
  sanctuary: '/assets/sanctuary.glb',
  sword: '/assets/sword.glb'
};

// Self-contained, 100% local WoW/Diablo-style painted SVG Icon Generator
function makeRpgSvgIcon(bgStart, bgEnd, innerSvg) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
    <defs>
      <radialGradient id="g" cx="50%" cy="40%" r="65%">
        <stop offset="0%" stop-color="${bgStart}"/>
        <stop offset="100%" stop-color="${bgEnd}"/>
      </radialGradient>
    </defs>
    <rect width="64" height="64" rx="8" fill="url(#g)"/>
    <rect x="2" y="2" width="60" height="60" rx="6" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
    ${innerSvg}
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

const RPG_ICONS = {
  // 7 Active Combat Skills
  slash: makeRpgSvgIcon('#334155', '#0f172a', `
    <path d="M14 50 L46 12 L54 10 L52 18 L20 50 Z" fill="#e2e8f0" stroke="#38bdf8" stroke-width="2"/>
    <path d="M12 40 L24 52 M8 56 L18 46" stroke="#facc15" stroke-width="4" stroke-linecap="round"/>
    <path d="M32 14 Q52 24 46 44" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  `),
  whirlwind: makeRpgSvgIcon('#0284c7', '#082f49', `
    <circle cx="32" cy="32" r="20" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="18 8"/>
    <circle cx="32" cy="32" r="12" fill="none" stroke="#bae6fd" stroke-width="3" stroke-dasharray="12 6"/>
    <path d="M16 32 L48 32 M32 16 L32 48" stroke="#f8fafc" stroke-width="4" stroke-linecap="round"/>
    <circle cx="32" cy="32" r="5" fill="#facc15"/>
  `),
  aether_bolt: makeRpgSvgIcon('#9333ea', '#2e1065', `
    <polygon points="36,8 16,34 30,34 24,56 48,28 34,28" fill="#f0abfc" stroke="#ffffff" stroke-width="2"/>
    <circle cx="32" cy="32" r="22" fill="none" stroke="#e879f9" stroke-width="2.5" stroke-dasharray="8 6"/>
  `),
  aegis_slam: makeRpgSvgIcon('#d97706', '#451a03', `
    <path d="M32 10 L50 18 V32 C50 44 41 52 32 56 C23 52 14 44 14 32 V18 Z" fill="#fbbf24" stroke="#fef08a" stroke-width="2.5"/>
    <path d="M32 16 V50 M20 28 H44" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
  `),
  crimson_fury: makeRpgSvgIcon('#e11d48', '#4c0519', `
    <path d="M14 50 L48 10 C54 22 46 38 24 52 Z" fill="#fda4af" stroke="#f43f5e" stroke-width="2"/>
    <circle cx="44" cy="44" r="4" fill="#fb7185"/>
    <circle cx="36" cy="50" r="3" fill="#fb7185"/>
    <path d="M10 54 L22 42" stroke="#facc15" stroke-width="5" stroke-linecap="round"/>
  `),
  holy_nova: makeRpgSvgIcon('#ca8a04', '#422006', `
    <circle cx="32" cy="32" r="12" fill="#fef08a" stroke="#facc15" stroke-width="3"/>
    <path d="M32 6 V16 M32 48 V58 M6 32 H16 M48 32 H58 M14 14 L21 21 M43 43 L50 50 M50 14 L43 21 M21 43 L14 50" stroke="#fde047" stroke-width="4" stroke-linecap="round"/>
  `),
  phantom_dash: makeRpgSvgIcon('#059669', '#064e3b', `
    <path d="M22 14 H38 L34 38 L48 42 C50 46 46 50 40 50 H18 Z" fill="#6ee7b7" stroke="#ecfdf5" stroke-width="2"/>
    <path d="M8 24 H18 M6 34 H16 M10 44 H16" stroke="#a7f3d0" stroke-width="3" stroke-linecap="round"/>
  `),

  // 3 Consumable Flasks
  potion: makeRpgSvgIcon('#16a34a', '#052e16', `
    <rect x="26" y="10" width="12" height="8" rx="2" fill="#fde68a" stroke="#fff" stroke-width="1.5"/>
    <path d="M24 18 H40 L48 34 C51 44 45 54 32 54 C19 54 13 44 16 34 Z" fill="#ef4444" stroke="#fecdd3" stroke-width="2.5"/>
    <path d="M26 36 H38 M32 30 V42" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
  `),
  ether: makeRpgSvgIcon('#2563eb', '#172554', `
    <rect x="26" y="10" width="12" height="8" rx="2" fill="#fde68a" stroke="#fff" stroke-width="1.5"/>
    <path d="M24 18 H40 L48 34 C51 44 45 54 32 54 C19 54 13 44 16 34 Z" fill="#38bdf8" stroke="#e0f2fe" stroke-width="2.5"/>
    <path d="M32 26 L24 38 H32 L30 46 L40 34 H32 Z" fill="#fef08a"/>
  `),
  elixir: makeRpgSvgIcon('#db2777', '#500724', `
    <rect x="26" y="10" width="12" height="8" rx="2" fill="#fde047" stroke="#fff" stroke-width="1.5"/>
    <circle cx="32" cy="37" r="17" fill="#f43f5e" stroke="#fda4af" stroke-width="2.5"/>
    <path d="M32 24 C38 32 40 38 32 48 C24 38 26 32 32 24 Z" fill="#fde047"/>
  `),

  // Equipment, Shop & Hero Class Icons
  'broadsword': makeRpgSvgIcon('#1e293b', '#090d16', `
    <path d="M14 50 L48 12 L54 10 L52 16 L18 50 Z" fill="#38bdf8" stroke="#e0f2fe" stroke-width="2"/>
    <path d="M12 40 L24 52 M10 54 L18 46" stroke="#facc15" stroke-width="4" stroke-linecap="round"/>
  `),
  'two-handed-sword': makeRpgSvgIcon('#4c1d95', '#090d16', `
    <path d="M12 52 L48 10 L56 8 L54 16 L18 52 Z" fill="#e879f9" stroke="#fae8ff" stroke-width="2"/>
    <path d="M10 38 L26 54 M8 56 L18 46" stroke="#fbbf24" stroke-width="4.5" stroke-linecap="round"/>
  `),
  'wizard-staff': makeRpgSvgIcon('#3b0764', '#090d16', `
    <path d="M12 54 L44 22" stroke="#d97706" stroke-width="5" stroke-linecap="round"/>
    <circle cx="48" cy="16" r="8" fill="#38bdf8" stroke="#bae6fd" stroke-width="2.5"/>
  `),
  'warhammer': makeRpgSvgIcon('#7c2d12', '#090d16', `
    <path d="M14 52 L42 24" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round"/>
    <rect x="30" y="10" width="24" height="14" rx="3" transform="rotate(45 42 17)" fill="#fbbf24" stroke="#fef08a" stroke-width="2"/>
  `),
  'visored-helm': makeRpgSvgIcon('#0284c7', '#090d16', `
    <path d="M16 48 V24 C16 12 48 12 48 24 V48 L32 54 Z" fill="#cbd5e1" stroke="#38bdf8" stroke-width="2.5"/>
    <path d="M20 30 H44 M22 38 H42 M32 20 V46" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
  `),
  'imperial-crown': makeRpgSvgIcon('#78350f', '#090d16', `
    <polygon points="12,46 16,20 26,32 32,16 38,32 48,20 52,46" fill="#facc15" stroke="#fef08a" stroke-width="2.5"/>
    <circle cx="32" cy="38" r="4" fill="#ef4444"/>
  `),
  'spartan-helmet': makeRpgSvgIcon('#b45309', '#090d16', `
    <path d="M28 8 C38 8 48 14 48 22 H20 C20 14 24 8 28 8 Z" fill="#ef4444" stroke="#fca5a5" stroke-width="1.5"/>
    <path d="M18 52 V24 C18 16 46 16 46 24 V52 L36 46 V32 H28 V46 Z" fill="#fbbf24" stroke="#fef08a" stroke-width="2.5"/>
  `),
  'wizard-face': makeRpgSvgIcon('#7e22ce', '#090d16', `
    <polygon points="12,42 32,8 52,42" fill="#c084fc" stroke="#f5d0fe" stroke-width="2.5"/>
    <ellipse cx="32" cy="42" rx="24" ry="6" fill="#9333ea" stroke="#f5d0fe" stroke-width="2"/>
    <circle cx="26" cy="48" r="3" fill="#38bdf8"/>
    <circle cx="38" cy="48" r="3" fill="#38bdf8"/>
  `),
  'space-suit': makeRpgSvgIcon('#047857', '#090d16', `
    <rect x="14" y="12" width="36" height="40" rx="12" fill="#34d399" stroke="#a7f3d0" stroke-width="2.5"/>
    <rect x="20" y="20" width="24" height="14" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
    <line x1="24" y1="42" x2="40" y2="42" stroke="#064e3b" stroke-width="4" stroke-linecap="round"/>
  `),
  'breastplate': makeRpgSvgIcon('#1e3a8a', '#090d16', `
    <path d="M16 14 L26 18 H38 L48 14 L52 28 L44 52 H20 L12 28 Z" fill="#38bdf8" stroke="#bae6fd" stroke-width="2.5"/>
    <path d="M32 18 V48 M22 30 H42" stroke="#e0f2fe" stroke-width="2"/>
  `),
  'chest-armor': makeRpgSvgIcon('#4c1d95', '#090d16', `
    <path d="M16 14 L26 18 H38 L48 14 L52 30 L44 52 H20 L12 30 Z" fill="#c084fc" stroke="#f3e8ff" stroke-width="2.5"/>
    <circle cx="32" cy="30" r="6" fill="#facc15"/>
  `),
  'shoulder-armor': makeRpgSvgIcon('#7f1d1d', '#090d16', `
    <path d="M12 22 C12 12 52 12 52 22 L46 50 H18 Z" fill="#f87171" stroke="#fecaca" stroke-width="2.5"/>
  `),
  'ring': makeRpgSvgIcon('#713f12', '#090d16', `
    <circle cx="32" cy="36" r="14" fill="none" stroke="#facc15" stroke-width="6"/>
    <polygon points="32,12 40,22 24,22" fill="#38bdf8" stroke="#fff" stroke-width="1.5"/>
  `),
  'emerald-necklace': makeRpgSvgIcon('#064e3b', '#090d16', `
    <path d="M16 16 C16 40 48 40 48 16" fill="none" stroke="#facc15" stroke-width="3"/>
    <polygon points="32,28 42,40 32,54 22,40" fill="#34d399" stroke="#ecfdf5" stroke-width="2"/>
  `),

  // Micro-Menu & Window Icons (I, O, C, S, M, Attributes, Mystery Chest, Anvil)
  'knapsack': makeRpgSvgIcon('#b45309', '#1c1917', `
    <path d="M24 12 H40 V18 H24 Z" fill="none" stroke="#fde68a" stroke-width="3"/>
    <rect x="14" y="16" width="36" height="38" rx="8" fill="#d97706" stroke="#fde68a" stroke-width="2.5"/>
    <rect x="20" y="28" width="24" height="16" rx="4" fill="#78350f" stroke="#fcd34d" stroke-width="2"/>
    <rect x="29" y="24" width="6" height="10" rx="2" fill="#facc15"/>
  `),
  'spell-book': makeRpgSvgIcon('#1d4ed8', '#090d16', `
    <rect x="14" y="10" width="36" height="44" rx="4" fill="#2563eb" stroke="#93c5fd" stroke-width="2.5"/>
    <line x1="20" y1="10" x2="20" y2="54" stroke="#fde047" stroke-width="3"/>
    <polygon points="34,20 37,27 44,27 38,32 40,39 34,35 28,39 30,32 24,27 31,27" fill="#facc15"/>
  `),
  'two-coins': makeRpgSvgIcon('#a16207', '#1c1917', `
    <circle cx="25" cy="26" r="13" fill="#facc15" stroke="#fef08a" stroke-width="2.5"/>
    <circle cx="39" cy="38" r="13" fill="#eab308" stroke="#fef08a" stroke-width="2.5"/>
    <text x="39" y="43" text-anchor="middle" fill="#422006" font-size="14" font-weight="900" font-family="sans-serif">$</text>
  `),
  'mystery-chest': makeRpgSvgIcon('#9333ea', '#1e1b4b', `
    <rect x="12" y="22" width="40" height="28" rx="4" fill="#b45309" stroke="#fde047" stroke-width="3"/>
    <path d="M12 32 H52" stroke="#fde047" stroke-width="4"/>
    <rect x="28" y="27" width="8" height="10" rx="2" fill="#facc15" stroke="#fff" stroke-width="1.5"/>
    <text x="32" y="20" text-anchor="middle" fill="#f0abfc" font-size="16" font-weight="900" font-family="sans-serif">?</text>
  `),
  'anvil': makeRpgSvgIcon('#475569', '#0f172a', `
    <path d="M10 24 H54 L46 34 H18 Z" fill="#cbd5e1" stroke="#f8fafc" stroke-width="2"/>
    <rect x="24" y="34" width="16" height="12" fill="#94a3b8"/>
    <rect x="16" y="46" width="32" height="8" rx="2" fill="#64748b" stroke="#cbd5e1" stroke-width="2"/>
  `),
  'dungeon-portal': makeRpgSvgIcon('#6d28d9', '#090d16', `
    <ellipse cx="32" cy="32" rx="18" ry="22" fill="none" stroke="#c084fc" stroke-width="5" stroke-dasharray="10 4"/>
    <ellipse cx="32" cy="32" rx="11" ry="15" fill="#3b0764" stroke="#38bdf8" stroke-width="3"/>
    <circle cx="32" cy="32" r="5" fill="#f0abfc"/>
  `),
  'chaos-orb': makeRpgSvgIcon('#b45309', '#1c1917', `
    <circle cx="32" cy="32" r="20" fill="#eab308" stroke="#fef08a" stroke-width="3"/>
    <circle cx="25" cy="28" r="4" fill="#1c1917"/>
    <circle cx="39" cy="28" r="4" fill="#1c1917"/>
    <path d="M22 42 Q32 36 42 42" fill="none" stroke="#1c1917" stroke-width="3.5" stroke-linecap="round"/>
  `),
  'vaal-orb': makeRpgSvgIcon('#991b1b', '#1c1917', `
    <circle cx="32" cy="32" r="20" fill="#dc2626" stroke="#fca5a5" stroke-width="3"/>
    <polygon points="24,26 28,30 22,30" fill="#090d16"/>
    <polygon points="40,26 42,30 36,30" fill="#090d16"/>
    <path d="M22 42 L27 38 L32 42 L37 38 L42 42" fill="none" stroke="#090d16" stroke-width="3"/>
  `),
  'stat-str': makeRpgSvgIcon('#9f1239', '#1c1917', `
    <path d="M16 46 L46 16 M34 14 H48 V28" fill="none" stroke="#fda4af" stroke-width="5" stroke-linecap="round"/>
    <circle cx="22" cy="40" r="8" fill="#f43f5e" stroke="#fff" stroke-width="2"/>
  `),
  'stat-dex': makeRpgSvgIcon('#065f46', '#1c1917', `
    <path d="M16 48 C20 22 44 18 48 14 C44 28 32 40 16 48 Z" fill="#34d399" stroke="#ecfdf5" stroke-width="2"/>
    <line x1="14" y1="50" x2="46" y2="18" stroke="#fef08a" stroke-width="3"/>
  `),
  'stat-vit': makeRpgSvgIcon('#b91c1c', '#1c1917', `
    <path d="M32 52 C32 52 12 38 12 24 C12 16 22 12 32 22 C42 12 52 16 52 24 C52 38 32 52 32 52 Z" fill="#fb7185" stroke="#fff" stroke-width="2.5"/>
  `),
  'stat-int': makeRpgSvgIcon('#0369a1', '#1c1917', `
    <polygon points="32,8 48,26 32,56 16,26" fill="#38bdf8" stroke="#e0f2fe" stroke-width="2.5"/>
    <line x1="32" y1="8" x2="32" y2="56" stroke="#bae6fd" stroke-width="2"/>
  `)
  // Dedicated Monster Avatars for Target Healthbar
  'monster_robot': makeRpgSvgIcon('#334155', '#0f172a', `
    <rect x="18" y="18" width="28" height="26" rx="4" fill="#64748b" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="26" cy="28" r="4" fill="#38bdf8"/>
    <circle cx="38" cy="28" r="4" fill="#38bdf8"/>
    <rect x="25" y="37" width="14" height="3" rx="1" fill="#0f172a"/>
    <line x1="32" y1="18" x2="32" y2="10" stroke="#facc15" stroke-width="3"/>
    <circle cx="32" cy="9" r="3" fill="#facc15"/>
  `),
  'monster_skeleton': makeRpgSvgIcon('#3f3f46', '#18181b', `
    <path d="M20 28 C20 18 44 18 44 28 C44 36 40 44 38 46 L26 46 C24 44 20 36 20 28 Z" fill="#e4e4e7" stroke="#a1a1aa" stroke-width="2"/>
    <circle cx="27" cy="28" r="3.5" fill="#ef4444"/>
    <circle cx="37" cy="28" r="3.5" fill="#ef4444"/>
    <line x1="28" y1="36" x2="36" y2="36" stroke="#18181b" stroke-width="2"/>
    <path d="M26 46 V50 M32 46 V50 M38 46 V50" stroke="#18181b" stroke-width="2"/>
  `),
  'monster_lich': makeRpgSvgIcon('#4c1d95', '#0f051d', `
    <path d="M16 48 C18 20 46 20 48 48 C40 44 24 44 16 48 Z" fill="#2e1065" stroke="#a855f7" stroke-width="2"/>
    <circle cx="27" cy="30" r="3.5" fill="#f0abfc"/>
    <circle cx="37" cy="30" r="3.5" fill="#f0abfc"/>
    <polygon points="32,10 36,20 28,20" fill="#c084fc"/>
    <circle cx="32" cy="38" r="3" fill="#a855f7" opacity="0.6"/>
  `),
  'monster_spider': makeRpgSvgIcon('#064e3b', '#022c22', `
    <ellipse cx="32" cy="32" rx="12" ry="10" fill="#047857" stroke="#10b981" stroke-width="2"/>
    <circle cx="28" cy="29" r="2" fill="#ef4444"/>
    <circle cx="36" cy="29" r="2" fill="#ef4444"/>
    <circle cx="30" cy="33" r="1.5" fill="#ef4444"/>
    <circle cx="34" cy="33" r="1.5" fill="#ef4444"/>
    <path d="M22 28 Q10 20 8 32 M42 28 Q54 20 56 32 M22 34 Q8 36 10 46 M42 34 Q56 36 54 46" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round"/>
  `),
  'monster_wasp': makeRpgSvgIcon('#854d0e', '#1c1917', `
    <ellipse cx="32" cy="32" rx="8" ry="14" fill="#eab308" stroke="#fef08a" stroke-width="2"/>
    <path d="M26 28 H38 M26 34 H38 M27 40 H37" stroke="#1c1917" stroke-width="3"/>
    <polygon points="32,46 29,54 35,54" fill="#f59e0b"/>
    <path d="M24 24 Q12 12 18 28 M40 24 Q52 12 46 28" fill="none" stroke="#bae6fd" stroke-width="3" stroke-linecap="round"/>
  `),
  'monster_golem': makeRpgSvgIcon('#78350f', '#291003', `
    <polygon points="20,16 44,16 50,38 32,54 14,38" fill="#92400e" stroke="#fbbf24" stroke-width="2"/>
    <line x1="22" y1="26" x2="30" y2="28" stroke="#f59e0b" stroke-width="3"/>
    <line x1="42" y1="26" x2="34" y2="28" stroke="#f59e0b" stroke-width="3"/>
    <circle cx="26" cy="27" r="2.5" fill="#ef4444"/>
    <circle cx="38" cy="27" r="2.5" fill="#ef4444"/>
  `),
  'monster_boss': makeRpgSvgIcon('#881337', '#1f040d', `
    <polygon points="16,36 20,20 26,26 32,14 38,26 44,20 48,36" fill="#facc15" stroke="#fef08a" stroke-width="2"/>
    <rect x="18" y="36" width="28" height="6" rx="2" fill="#e11d48" stroke="#fb7185" stroke-width="1.5"/>
    <circle cx="26" cy="30" r="3" fill="#ef4444"/>
    <circle cx="38" cy="30" r="3" fill="#ef4444"/>
    <polygon points="32,44 26,52 38,52" fill="#f43f5e"/>
  `)
};

// Convenience aliases for UI elements
RPG_ICONS['health-potion'] = RPG_ICONS.potion;
RPG_ICONS['mana-potion'] = RPG_ICONS.ether;
RPG_ICONS['round-bottom-flask'] = RPG_ICONS.elixir;
RPG_ICONS['angel-outfit'] = RPG_ICONS.holy_nova;
RPG_ICONS['crossed-swords'] = RPG_ICONS.slash;
RPG_ICONS['shield-bash'] = RPG_ICONS.aegis_slam;

function getRpgIcon(key) {
  return RPG_ICONS[key] || RPG_ICONS.broadsword;
}

function getMonsterAvatar(e) {
  if (!e) return getRpgIcon('monster_skeleton');
  if (e.isBoss) return getRpgIcon('monster_boss');
  const name = String(e.name || '').toLowerCase();
  if (name.includes('automaton') || name.includes('robot') || name.includes('construct')) {
    return getRpgIcon('monster_robot');
  }
  if (name.includes('corruptor') || name.includes('lich') || name.includes('necromancer') || name.includes('mage')) {
    return getRpgIcon('monster_lich');
  }
  if (name.includes('spider') || name.includes('arachnid') || name.includes('broodmother')) {
    return getRpgIcon('monster_spider');
  }
  if (name.includes('stalker') || name.includes('wasp') || name.includes('flier') || name.includes('swarmer')) {
    return getRpgIcon('monster_wasp');
  }
  if (name.includes('golem') || name.includes('titan')) {
    return getRpgIcon('monster_golem');
  }
  return getRpgIcon('monster_skeleton');
}

// All skills & consumables that can be dragged onto the 10-slot WoW Action Bar
const ACTION_CATALOG = {
  slash: {
    id: 'slash',
    type: 'skill',
    name: 'Sword Slash',
    subtitle: 'Basic Melee Strike',
    icon: RPG_ICONS.slash,
    borderColor: '#94a3b8',
    mpCost: 0,
    cooldownMs: 360,
    range: 6.8,
    baseMult: 1.0,
    anim: 'Attack',
    waveColor: 0x38bdf8,
    burstEmoji: 'ATK',
    desc: 'Fast horizontal greatsword cleave hitting enemies within 6.8m for 100% ATK (+20% per Rank).'
  },
  whirlwind: {
    id: 'whirlwind',
    type: 'skill',
    name: 'Whirlwind Cleave',
    subtitle: '360° Blade Tempest',
    icon: RPG_ICONS.whirlwind,
    borderColor: '#38bdf8',
    mpCost: 14,
    cooldownMs: 1400,
    range: 10.5,
    baseMult: 2.1,
    anim: 'Skill',
    waveColor: 0x22d3ee,
    burstEmoji: 'SPIN',
    desc: 'Spinning 360° blade storm slicing all enemies within 10.5m for 210% ATK and ignoring 40% DEF.'
  },
  aether_bolt: {
    id: 'aether_bolt',
    type: 'skill',
    name: 'Aether Nova',
    subtitle: 'Arcane Burst & Drain',
    icon: RPG_ICONS.aether_bolt,
    borderColor: '#e879f9',
    mpCost: 18,
    cooldownMs: 1800,
    range: 13.0,
    baseMult: 2.5,
    anim: 'Cast',
    waveColor: 0xd946ef,
    burstEmoji: 'NOVA',
    desc: 'Unleashes an Aether shockwave up to 13m for 250% ATK + INT scaling and leeches 12% Max HP.'
  },
  aegis_slam: {
    id: 'aegis_slam',
    type: 'skill',
    name: 'Aegis Thunder Slam',
    subtitle: 'Crushing Shockwave',
    icon: RPG_ICONS.aegis_slam,
    borderColor: '#fbbf24',
    mpCost: 15,
    cooldownMs: 1600,
    range: 9.0,
    baseMult: 1.9,
    anim: 'Chop',
    waveColor: 0xfacc15,
    burstEmoji: 'SLAM',
    desc: 'Slams the ground for 190% ATK within 9m and permanently bolsters your Base DEF by +1.'
  },
  crimson_fury: {
    id: 'crimson_fury',
    type: 'skill',
    name: 'Crimson Execution',
    subtitle: 'Lethal Rend Strike',
    icon: RPG_ICONS.crimson_fury,
    borderColor: '#fb7185',
    mpCost: 22,
    cooldownMs: 2400,
    range: 8.5,
    baseMult: 3.1,
    anim: 'Skill',
    waveColor: 0xf43f5e,
    burstEmoji: 'REND',
    desc: 'Devastating execution blow dealing 310% ATK with guaranteed Critical Strike bonus.'
  },
  holy_nova: {
    id: 'holy_nova',
    type: 'skill',
    name: 'Sanctuary Light',
    subtitle: 'Radiant Heal & Smite',
    icon: RPG_ICONS.holy_nova,
    borderColor: '#fde047',
    mpCost: 20,
    cooldownMs: 2800,
    range: 10.0,
    baseMult: 1.6,
    anim: 'Use',
    waveColor: 0xfde047,
    burstEmoji: 'HEAL',
    desc: 'Restores 30% Max HP (+INT scaling) immediately while smiting enemies within 10m for 160% ATK.'
  },
  phantom_dash: {
    id: 'phantom_dash',
    type: 'skill',
    name: 'Shadowstep Dash',
    subtitle: 'Mobility & Blink',
    icon: RPG_ICONS.phantom_dash,
    borderColor: '#34d399',
    mpCost: 6,
    cooldownMs: 900,
    range: 6.0,
    baseMult: 1.2,
    anim: 'Dash',
    waveColor: 0x34d399,
    burstEmoji: 'DASH',
    desc: 'Surges 8m forward in your facing direction and slices nearby foes for 120% ATK.'
  },
  potion: {
    id: 'potion',
    type: 'consumable',
    name: 'Crimson Health Potion',
    subtitle: 'Consumable Flask',
    icon: RPG_ICONS.potion,
    borderColor: '#4ade80',
    mpCost: 0,
    cooldownMs: 800,
    desc: 'Instantly restores 45% of your Maximum Health.'
  },
  ether: {
    id: 'ether',
    type: 'consumable',
    name: 'Azure Mana Ether',
    subtitle: 'Consumable Flask',
    icon: RPG_ICONS.ether,
    borderColor: '#60a5fa',
    mpCost: 0,
    cooldownMs: 800,
    desc: 'Instantly restores 50% of your Maximum Mana.'
  },
  elixir: {
    id: 'elixir',
    type: 'consumable',
    name: 'Elixir of Blood Fury',
    subtitle: 'Combat Stimulant',
    icon: RPG_ICONS.elixir,
    borderColor: '#f43f5e',
    mpCost: 0,
    cooldownMs: 1500,
    desc: 'Grants Battle Fury for 20 seconds: +35% Total Attack Power and +20% Critical Strike Chance!'
  }
};

const SKILL_IDS = [
  'slash',
  'whirlwind',
  'aether_bolt',
  'aegis_slam',
  'crimson_fury',
  'holy_nova',
  'phantom_dash'
];

// World of Warcraft Dungeon Finder + Path of Exile Atlas Zones
const DUNGEON_ZONES = [
  {
    id: 'outpost_wilds',
    name: 'Arcana Wilds & Outpost Hub',
    category: 'Open World Zone',
    minLevel: 1,
    tier: 1,
    skyColor: 0x131b38,
    groundTint: 0xffffff,
    monsterMult: 1.0,
    packCount: 24,
    killTarget: 10,
    bossName: 'Vaelen, Void Architect',
    bossHp: 420,
    bossAtk: 36,
    bossDef: 14,
    bossScale: 2.1,
    bossModel: 'skeletonWarrior',
    icon: 'visored-helm',
    borderColor: '#38bdf8',
    desc: 'The central Sanctuary Nexus surrounded by ruined columns, Scrap Automatons, and Void Stalkers.'
  },
  {
    id: 'sunken_catacombs',
    name: 'Sunken Catacombs of Karzhul',
    category: 'WoW 5-Man Dungeon',
    minLevel: 4,
    tier: 3,
    skyColor: 0x1a1033,
    groundTint: 0x8b5cf6,
    monsterMult: 1.45,
    packCount: 30,
    killTarget: 12,
    bossName: 'High Lich Malakor',
    bossHp: 780,
    bossAtk: 56,
    bossDef: 22,
    bossScale: 2.35,
    bossModel: 'skeletonMage',
    icon: 'wizard-face',
    borderColor: '#a855f7',
    desc: 'Haunted necropolis teeming with Risen Deathknights, Crypt Necromancers, and Bone Golems.'
  },
  {
    id: 'molten_caldera',
    name: 'Crimson Molten Caldera',
    category: 'Heroic Raid Wing',
    minLevel: 8,
    tier: 6,
    skyColor: 0x2d0a12,
    groundTint: 0xf87171,
    monsterMult: 2.1,
    packCount: 32,
    killTarget: 14,
    bossName: 'Ignis the Worldbreaker',
    bossHp: 1350,
    bossAtk: 88,
    bossDef: 35,
    bossScale: 2.6,
    bossModel: 'robot',
    icon: 'warhammer',
    borderColor: '#f43f5e',
    desc: 'Scorched volcanic abyss guarded by Hellfire Automatons, Magma Titans, and Cinder Wasps.'
  },
  {
    id: 'bramble_abyss',
    name: 'Twisted Bramblewood Abyss',
    category: 'Mythic+ Key Dungeon',
    minLevel: 12,
    tier: 9,
    skyColor: 0x062419,
    groundTint: 0x34d399,
    monsterMult: 2.85,
    packCount: 36,
    killTarget: 15,
    bossName: 'Arachneia, Broodmother Queen',
    bossHp: 2100,
    bossAtk: 125,
    bossDef: 48,
    bossScale: 2.75,
    bossModel: 'spider',
    icon: 'emerald-necklace',
    borderColor: '#10b981',
    desc: 'Venom-drenched ancient thicket crawling with Giant Brood Spiders and Toxic Swarmers.'
  },
  {
    id: 'shaper_crucible',
    name: "The Shaper's Celestial Crucible",
    category: 'Path of Exile T16 Map',
    minLevel: 16,
    tier: 14,
    skyColor: 0x0c1938,
    groundTint: 0x60a5fa,
    monsterMult: 3.8,
    packCount: 40,
    killTarget: 18,
    bossName: 'Aethelgard, The Starforged Shaper',
    bossHp: 3400,
    bossAtk: 175,
    bossDef: 68,
    bossScale: 2.9,
    bossModel: 'skeletonWarrior',
    icon: 'imperial-crown',
    borderColor: '#facc15',
    desc: 'Endgame Atlas Map where reality bends. High monster pack density and exalted equipment drops.'
  },
  {
    id: 'uber_pinnacle',
    name: 'Heart of the Atlas (Uber Pinnacle)',
    category: 'PoE Pinnacle Boss Arena',
    minLevel: 22,
    tier: 20,
    skyColor: 0x24062e,
    groundTint: 0xe879f9,
    monsterMult: 5.2,
    packCount: 44,
    killTarget: 20,
    bossName: 'Uber Void Emperor & Elder Construct',
    bossHp: 5600,
    bossAtk: 245,
    bossDef: 95,
    bossScale: 3.1,
    bossModel: 'skeletonWarrior',
    twinBoss: true,
    icon: 'two-handed-sword',
    borderColor: '#fb923c',
    desc: 'Ultimate Path of Exile endgame crucible. Features Twin Pinnacle Bosses and guaranteed Legendary loot!'
  }
];

// Path of Exile Map Device Affixes (rollable with Alchemy / Chaos / Vaal Orbs)
const POE_MAP_AFFIX_POOL = [
  { id: 'savage', name: 'of Savage Brutality', desc: 'Monsters deal +30% increased Damage', dmgMult: 1.3, hpMult: 1.0, packMult: 1.0, quantBonus: 25 },
  { id: 'titan', name: 'Titan-Forged', desc: 'Monsters have +45% increased Maximum Life', dmgMult: 1.0, hpMult: 1.45, packMult: 1.0, quantBonus: 30 },
  { id: 'horde', name: 'Teeming Hordes', desc: '+35% increased Monster Pack Size', dmgMult: 1.0, hpMult: 1.0, packMult: 1.35, quantBonus: 35 },
  { id: 'twinned', name: 'Twinned Overlords', desc: 'Area contains Two Unique Bosses simultaneously!', dmgMult: 1.1, hpMult: 1.15, packMult: 1.1, twinBoss: true, quantBonus: 55 },
  { id: 'armored', name: 'Obsidian-Clad', desc: 'Monsters gain +40% Physical Resistance & Gold Drop', dmgMult: 1.1, hpMult: 1.25, packMult: 1.0, quantBonus: 35 },
  { id: 'frenzy', name: 'of Blood Frenzy', desc: 'Monsters have Onslaught (+25% Chase Speed & Attack Rate)', dmgMult: 1.2, hpMult: 1.1, speedMult: 1.25, packMult: 1.15, quantBonus: 40 }
];

const ENEMY_TYPES = [
  { name: "Scrap Automaton", icon: "BOT", color: 0x94a3b8, hp: 55, atk: 12, def: 4, xp: 35, gold: 20, scale: 1.0 },
  { name: "Arcana Stalker", icon: "WASP", color: 0xa855f7, hp: 70, atk: 15, def: 3, xp: 50, gold: 30, scale: 1.15 },
  { name: "Venom Arachnid", icon: "SPDR", color: 0x10b981, hp: 80, atk: 17, def: 5, xp: 60, gold: 35, scale: 1.2 },
  { name: "Aether Corruptor", icon: "MAGE", color: 0xec4899, hp: 95, atk: 19, def: 7, xp: 75, gold: 45, scale: 1.15 },
  { name: "Obsidian Golem", icon: "SKEL", color: 0xef4444, hp: 145, atk: 24, def: 12, xp: 115, gold: 75, scale: 1.35 }
];

const LOOT_TEMPLATES = [
  { name: 'Voidforged Claymore', slot: 'weapon', icon: 'two-handed-sword', baseAtk: 10, baseDef: 0 },
  { name: 'Runeblade of Haste', slot: 'weapon', icon: 'broadsword', baseAtk: 8, baseDef: 2 },
  { name: 'Archmage Grand Staff', slot: 'weapon', icon: 'wizard-staff', baseAtk: 9, baseDef: 1 },
  { name: 'Sunfire Warhammer', slot: 'weapon', icon: 'warhammer', baseAtk: 12, baseDef: 0 },
  { name: 'Helm of the Immortal', slot: 'helm', icon: 'visored-helm', baseAtk: 2, baseDef: 6 },
  { name: 'Diadem of Starlight', slot: 'helm', icon: 'imperial-crown', baseAtk: 3, baseDef: 5 },
  { name: 'Dreadknight Casque', slot: 'helm', icon: 'spartan-helmet', baseAtk: 1, baseDef: 8 },
  { name: 'Aethersteel Harness', slot: 'armor', icon: 'breastplate', baseAtk: 2, baseDef: 10 },
  { name: 'Robes of the Archon', slot: 'armor', icon: 'chest-armor', baseAtk: 4, baseDef: 8 },
  { name: 'Titanbone Carapace', slot: 'armor', icon: 'shoulder-armor', baseAtk: 1, baseDef: 12 },
  { name: 'Eye of the Maelstrom', slot: 'relic', icon: 'emerald-necklace', baseAtk: 6, baseDef: 4 },
  { name: 'Chronos Band', slot: 'relic', icon: 'ring', baseAtk: 5, baseDef: 5 }
];

const RARITY_TIERS = [
  { name: 'Common', color: '#94a3b8', mult: 1.0 },
  { name: 'Magic', color: '#38bdf8', mult: 1.35 },
  { name: 'Rare', color: '#facc15', mult: 1.75 },
  { name: 'Epic', color: '#c084fc', mult: 2.25 },
  { name: 'Legendary', color: '#fb923c', mult: 3.0 }
];
