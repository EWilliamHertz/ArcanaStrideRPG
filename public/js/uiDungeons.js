// ============================================================
// ARCANASTRIDE 3D: [M] WOW DUNGEON FINDER & PATH OF EXILE ATLAS
// ============================================================

function getActiveZoneConfig() {
  return DUNGEON_ZONES.find(z => z.id === activeZoneId) || DUNGEON_ZONES[0];
}

// Alias for backwards compatibility
function getActiveZone() {
  return getActiveZoneConfig();
}

function getMapModifiersSummary() {
  let dmgMult = 1.0;
  let hpMult = 1.0;
  let packMult = 1.0;
  let speedMult = 1.0;
  let quantBonus = 0;
  let twinBoss = false;

  (activeMapAffixes || []).forEach(aff => {
    dmgMult *= (aff.dmgMult || 1.0);
    hpMult *= (aff.hpMult || 1.0);
    packMult *= (aff.packMult || 1.0);
    speedMult *= (aff.speedMult || 1.0);
    quantBonus += (aff.quantBonus || 0);
    if (aff.twinBoss) twinBoss = true;
  });

  if (selectedMapRarity === 'Corrupted') {
    quantBonus += 60;
    twinBoss = true;
  }

  return {
    dmgMult: Math.round(dmgMult * 100) / 100,
    hpMult: Math.round(hpMult * 100) / 100,
    packMult: Math.round(packMult * 100) / 100,
    speedMult: Math.round(speedMult * 100) / 100,
    quantBonus,
    twinBoss,
    quantMult: 1 + quantBonus / 100
  };
}

// Alias for backwards compatibility
function getMapAggregateBonuses() {
  return getMapModifiersSummary();
}

function toggleDungeonModal() {
  const modal = document.getElementById('dungeon-modal');
  if (!modal) return;
  const isHidden = modal.classList.contains('hidden');
  if (isHidden) {
    const statsModal = document.getElementById('stats-modal');
    if (statsModal) statsModal.classList.add('hidden');
    const invModal = document.getElementById('inventory-modal');
    if (invModal) invModal.classList.add('hidden');
    const classModal = document.getElementById('class-modal');
    if (classModal) classModal.classList.add('hidden');
    renderDungeonModal();
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
}

function selectPoEMapRarity(rarity) {
  const norm = String(rarity || 'normal').toLowerCase();
  if (norm === 'normal') {
    selectedMapRarity = 'Normal';
    activeMapAffixes = [];
    addLog("Scoured Map to Normal (White) — 0 Modifiers.", "text-slate-300");
  } else if (norm === 'magic') {
    selectedMapRarity = 'Magic';
    activeMapAffixes = pickRandomAffixes(2);
    addLog("Rolled Magic (Blue) Map with 2 Path of Exile Affixes!", "text-cyan-300 font-bold");
  } else if (norm === 'rare') {
    selectedMapRarity = 'Rare';
    activeMapAffixes = pickRandomAffixes(3 + Math.floor(Math.random() * 2));
    addLog("Rolled Rare (Yellow) Map with high danger & bonus loot!", "text-yellow-300 font-bold");
  } else if (norm === 'corrupted' || norm === 'vaal') {
    selectedMapRarity = 'Corrupted';
    activeMapAffixes = pickRandomAffixes(5);
    addLog("★★★ Vaal Corrupted Map (5 Affixes + Twin Bosses + +120% Loot)! ★★★", "text-rose-400 font-extrabold");
  }
  updateDungeonTrackerUI();
  updateHUD();
  renderDungeonModal();
  syncSave();
}

function rollPoEMapAffixes(mode = 'rare') {
  if (mode === true || mode === 'reforge' || mode === 'rare') {
    if ((player.chaosOrbs || 0) > 0) {
      player.chaosOrbs -= 1;
      addLog("★ Reforged Map Affixes with 1 Chaos Orb!", "text-yellow-300 font-bold");
    } else if (player.gold >= 100) {
      player.gold -= 100;
      addLog("★ Spent 100 Gold to Reforge Map Affixes!", "text-amber-300 font-bold");
    } else {
      addLog("Need 1 Chaos Orb or 100 Gold to Reforge Map Affixes!", "text-rose-400 font-bold");
      return;
    }
    selectedMapRarity = selectedMapRarity === 'Corrupted' ? 'Corrupted' : 'Rare';
    const count = selectedMapRarity === 'Corrupted' ? 5 : (3 + Math.floor(Math.random() * 2));
    activeMapAffixes = pickRandomAffixes(count);
  } else {
    selectPoEMapRarity(mode);
    return;
  }
  updateDungeonTrackerUI();
  updateHUD();
  renderDungeonModal();
  syncSave();
}

function pickRandomAffixes(count) {
  const pool = [...POE_MAP_AFFIX_POOL];
  const chosen = [];
  while (chosen.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    chosen.push(pool.splice(idx, 1)[0]);
  }
  return chosen;
}

function enterDungeonZone(zoneId) {
  const zone = DUNGEON_ZONES.find(z => z.id === zoneId) || DUNGEON_ZONES[0];
  activeZoneId = zone.id;
  dungeonKills = 0;
  dungeonBossSpawned = false;

  // Clear current targeted enemy if any
  if (typeof clearTargetEnemy === 'function') {
    clearTargetEnemy();
  }

  // Update 3D Scene Atmosphere (Sky, Fog & Terrain tint)
  scene.background = new THREE.Color(zone.skyColor);
  scene.fog = new THREE.FogExp2(zone.skyColor, 0.0034);
  ground.material.color = new THREE.Color(zone.groundTint);

  // Teleport Hero to Zone Entrance
  playerGroup.position.set(0, 0, 18);
  playerGroup.rotation.y = Math.PI;
  createBurst(playerGroup.position, 0xc084fc, 28, 'NOVA');

  populateWorld();
  updateDungeonTrackerUI();
  updateHUD();
  syncSave();

  const modal = document.getElementById('dungeon-modal');
  if (modal) modal.classList.add('hidden');

  const modSummary = getMapModifiersSummary();
  addLog(
    `★ Entered [${selectedMapRarity}] ${zone.name} (Tier ${zone.tier} • +${modSummary.quantBonus}% Loot)! Slay ${zone.killTarget} foes to summon ${zone.bossName}!`,
    "text-amber-300 font-extrabold"
  );
}

function returnToOutpostHub() {
  enterDungeonZone('outpost_wilds');
  addLog("Warped back to Sanctuary Outpost Hub.", "text-emerald-400 font-bold");
  const modal = document.getElementById('dungeon-modal');
  if (modal) modal.classList.add('hidden');
}

function updateDungeonTrackerUI() {
  const zone = getActiveZoneConfig();
  const modSummary = getMapModifiersSummary();

  const titleEl = document.getElementById('tracker-zone-name');
  const subEl = document.getElementById('tracker-zone-mods');
  const progTextEl = document.getElementById('tracker-progress-text');
  const progBarEl = document.getElementById('tracker-progress-bar');

  if (!titleEl) return;

  const rarityColor = selectedMapRarity === 'Corrupted' ? '#f43f5e'
    : selectedMapRarity === 'Rare' ? '#facc15'
    : selectedMapRarity === 'Magic' ? '#38bdf8' : '#e2e8f0';

  titleEl.innerHTML = `<span style="color:${rarityColor}">[${selectedMapRarity}] ${zone.name}</span> <span class="text-[10px] text-amber-300">(Tier ${zone.tier})</span>`;

  if (activeMapAffixes.length > 0) {
    subEl.innerText = activeMapAffixes.map(a => a.name).join(' • ') + ` (+${modSummary.quantBonus}% Loot)`;
  } else {
    subEl.innerText = `${zone.category} • Boss: ${zone.bossName}`;
  }

  const pct = Math.min(100, Math.round((dungeonKills / zone.killTarget) * 100));
  if (progBarEl) progBarEl.style.width = `${pct}%`;

  const bossAlive = enemies.some(e => e.isBoss);
  if (progTextEl) {
    if (bossAlive) {
      progTextEl.innerText = `★ BOSS ENGAGED: Slay ${zone.bossName}! ★`;
    } else if (dungeonKills >= zone.killTarget) {
      progTextEl.innerText = `★ Dungeon Cleared (${dungeonKills}/${zone.killTarget}) — Click [Boss] or Re-Queue [M]!`;
    } else {
      progTextEl.innerText = `Dungeon Forces: ${dungeonKills} / ${zone.killTarget} Slain (Spawns ${zone.bossName})`;
    }
  }
}

function summonZoneBossNow() {
  const zone = getActiveZoneConfig();
  const modSummary = getMapModifiersSummary();
  if (enemies.some(e => e.isBoss)) {
    addLog(`${zone.bossName} is already active in this instance!`, "text-amber-300");
    return;
  }
  dungeonBossSpawned = true;
  spawnEnemy(true);
  if (zone.twinBoss || modSummary.twinBoss) {
    spawnEnemy(true);
    addLog(`★★★ TWINNED PINNACLE BOSSES: Two ${zone.bossName}s have materialized! ★★★`, "text-rose-400 font-extrabold");
  } else {
    addLog(`★ BOSS SUMMONED: ${zone.bossName} has entered the arena!`, "text-rose-400 font-extrabold");
  }
  updateDungeonTrackerUI();
}

function renderDungeonModal() {
  // Support both ID naming conventions
  const chaosEl = document.getElementById('poe-chaos-count') || document.getElementById('modal-chaos-count');
  const affixBox = document.getElementById('poe-affix-list') || document.getElementById('active-map-affixes');
  const summaryEl = document.getElementById('poe-bonus-summary');
  const listEl = document.getElementById('dungeon-zone-list') || document.getElementById('dungeon-zones-list');

  if (chaosEl) chaosEl.innerText = player.chaosOrbs || 0;

  const modSummary = getMapModifiersSummary();
  const currentRarity = (selectedMapRarity || 'Normal').toLowerCase();

  // 1. Update Rarity Buttons
  const rarities = ['normal', 'magic', 'rare', 'corrupted'];
  rarities.forEach(r => {
    const btn = document.getElementById(`rarity-btn-${r}`);
    if (!btn) return;
    if (r === currentRarity) {
      if (r === 'normal') btn.className = 'px-2.5 py-1.5 rounded-lg border text-xs bg-slate-800 text-white font-bold border-slate-300 shadow-md ring-2 ring-slate-400';
      else if (r === 'magic') btn.className = 'px-2.5 py-1.5 rounded-lg border text-xs bg-cyan-950 text-cyan-200 font-bold border-cyan-400 shadow-md ring-2 ring-cyan-400';
      else if (r === 'rare') btn.className = 'px-2.5 py-1.5 rounded-lg border text-xs bg-amber-950 text-amber-200 font-bold border-yellow-400 shadow-md ring-2 ring-yellow-400';
      else if (r === 'corrupted') btn.className = 'px-2.5 py-1.5 rounded-lg border text-xs bg-rose-950 text-rose-200 font-black border-rose-500 shadow-md ring-2 ring-rose-500';
    } else {
      btn.className = 'px-2.5 py-1.5 rounded-lg border text-xs bg-slate-900 text-slate-400 border-slate-700 hover:text-white hover:border-slate-500 transition';
    }
  });

  // 2. Update Affixes Box
  if (affixBox) {
    if (!activeMapAffixes || activeMapAffixes.length === 0) {
      affixBox.innerHTML = `
        <div class="text-[11px] text-slate-400 italic p-2 bg-slate-900/60 rounded-lg border border-slate-800">
          Current State: <b class="text-white">Normal (0 Modifiers)</b>.<br/>Select Magic, Rare, or Vaal Corrupted, or click Reforge with Chaos Orbs to craft deadly modifiers with high bonus loot!
        </div>`;
    } else {
      affixBox.innerHTML = activeMapAffixes.map(a => `
        <div class="p-2 rounded-lg bg-slate-900/90 border border-amber-700/40 text-[11px]">
          <div class="font-black text-amber-300 flex items-center justify-between mb-0.5">
            <span>• ${a.name}</span>
            <span class="text-[9px] text-emerald-400 font-mono">+${a.quantBonus || 0}% Loot</span>
          </div>
          <div class="text-[10px] text-slate-300">${a.desc}</div>
        </div>
      `).join('');
    }
  }

  // 3. Update Yield & Danger Summary
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-center">
        <span class="text-[9px] text-slate-400 block font-bold">BONUS LOOT</span>
        <span class="text-xs font-black text-emerald-400">+${modSummary.quantBonus}%</span>
      </div>
      <div class="bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-center">
        <span class="text-[9px] text-slate-400 block font-bold">MONSTER HP</span>
        <span class="text-xs font-black text-rose-400">+${Math.round((modSummary.hpMult - 1) * 100)}%</span>
      </div>
      <div class="bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-center">
        <span class="text-[9px] text-slate-400 block font-bold">MONSTER DMG</span>
        <span class="text-xs font-black text-amber-400">+${Math.round((modSummary.dmgMult - 1) * 100)}%</span>
      </div>
      <div class="bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-center">
        <span class="text-[9px] text-slate-400 block font-bold">PACK DENSITY</span>
        <span class="text-xs font-black text-cyan-400">+${Math.round((modSummary.packMult - 1) * 100)}%</span>
      </div>
    `;
  }

  // 4. Update Dungeon Zones List
  if (listEl) {
    listEl.innerHTML = '';
    DUNGEON_ZONES.forEach(zone => {
      const isCurrent = zone.id === activeZoneId;
      const effHp = Math.round(zone.monsterMult * modSummary.hpMult * 100);
      const effDmg = Math.round(zone.monsterMult * modSummary.dmgMult * 100);

      const card = document.createElement('div');
      card.className = `p-3.5 rounded-xl border-2 transition flex flex-col justify-between bg-slate-900/95 hover:bg-slate-900 shadow-lg`;
      card.style.borderColor = isCurrent ? '#facc15' : zone.borderColor;

      card.innerHTML = `
        <div>
          <div class="flex items-center gap-2.5 mb-2">
            <img src="${getRpgIcon(zone.icon)}" class="w-11 h-11 rounded-lg border border-amber-500/50 shrink-0" alt="" />
            <div class="min-w-0 flex-1">
              <div class="flex justify-between items-center">
                <span class="text-[10px] uppercase font-extrabold tracking-wider" style="color:${zone.borderColor}">${zone.category}</span>
                <span class="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-700 font-bold text-amber-300">Tier ${zone.tier} (Lv.${zone.minLevel}+)</span>
              </div>
              <h3 class="text-sm font-black text-white truncate">${zone.name}</h3>
            </div>
          </div>
          <p class="text-[11px] text-slate-300 mb-2 leading-snug">${zone.desc}</p>
          <div class="bg-slate-950/90 p-2 rounded-lg border border-slate-800 text-[10px] space-y-0.5 mb-2.5">
            <div class="flex justify-between"><span class="text-slate-400">Dungeon Boss:</span><b class="text-rose-300">${zone.bossName}</b></div>
            <div class="flex justify-between"><span class="text-slate-400">Monster Scaling:</span><b class="text-amber-300">${effHp}% HP • ${effDmg}% DMG</b></div>
            <div class="flex justify-between"><span class="text-slate-400">Total Loot Quantity:</span><b class="text-emerald-300">+${(zone.tier - 1) * 20 + modSummary.quantBonus}% Bonus</b></div>
          </div>
        </div>
        <button onclick="enterDungeonZone('${zone.id}')"
                class="w-full py-2 rounded-lg font-extrabold text-xs transition shadow-md ${isCurrent ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-yellow-300' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}">
          ${isCurrent ? '★ Current Zone (Click to Reset/Re-Instance)' : 'Teleport to Dungeon'}
        </button>
      `;
      listEl.appendChild(card);
    });
  }
}

