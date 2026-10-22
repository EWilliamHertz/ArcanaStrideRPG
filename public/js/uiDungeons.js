// ============================================================
// ARCANASTRIDE 3D: [M] WOW DUNGEON FINDER & PATH OF EXILE ATLAS
// ============================================================

function getActiveZoneConfig() {
  return DUNGEON_ZONES.find(z => z.id === activeZoneId) || DUNGEON_ZONES[0];
}

function getMapModifiersSummary() {
  let dmgMult = 1.0;
  let hpMult = 1.0;
  let packMult = 1.0;
  let speedMult = 1.0;
  let quantBonus = 0;
  let twinBoss = false;

  activeMapAffixes.forEach(aff => {
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

  return { dmgMult, hpMult, packMult, speedMult, quantBonus, twinBoss };
}

function toggleDungeonModal() {
  const modal = document.getElementById('dungeon-modal');
  if (!modal) return;
  const isHidden = modal.classList.contains('hidden');
  if (isHidden) {
    document.getElementById('stats-modal').classList.add('hidden');
    document.getElementById('inventory-modal').classList.add('hidden');
    renderDungeonModal();
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
}

function rollPoEMapAffixes(mode) {
  if (mode === 'normal') {
    selectedMapRarity = 'Normal';
    activeMapAffixes = [];
    addLog("Scoured Map to Normal (White) — 0 Modifiers.", "text-slate-300");
  } else if (mode === 'magic') {
    if (player.gold < 40) return addLog("Need 40 Gold to Transmute Map!", "text-rose-400");
    player.gold -= 40;
    selectedMapRarity = 'Magic';
    activeMapAffixes = pickRandomAffixes(2);
    addLog("Transmuted Map to Magic (Blue) with 2 Path of Exile Affixes!", "text-cyan-300 font-bold");
  } else if (mode === 'rare') {
    if ((player.chaosOrbs || 0) > 0) {
      player.chaosOrbs -= 1;
    } else if (player.gold >= 100) {
      player.gold -= 100;
    } else {
      return addLog("Need 1 Chaos Orb or 100 Gold to Chaos-Roll a Rare Map!", "text-rose-400");
    }
    selectedMapRarity = 'Rare';
    activeMapAffixes = pickRandomAffixes(3 + Math.floor(Math.random() * 2));
    addLog("★ CHAOS ORB REFORGED: Map is now Rare (Yellow) with deadly modifiers & high loot quantity!", "text-yellow-300 font-bold");
  } else if (mode === 'vaal') {
    if ((player.chaosOrbs || 0) >= 2) {
      player.chaosOrbs -= 2;
    } else if (player.gold >= 220) {
      player.gold -= 220;
    } else {
      return addLog("Need 2 Chaos Orbs or 220 Gold to Vaal-Corrupt a Map!", "text-rose-400");
    }
    selectedMapRarity = 'Corrupted';
    activeMapAffixes = pickRandomAffixes(5);
    addLog("★★★ VAAL ORB CORRUPTION: Map is now Corrupted Red (5 Affixes + Twin Bosses + +200% Loot)!", "text-rose-400 font-extrabold");
  }
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

  document.getElementById('dungeon-modal').classList.add('hidden');
  const modSummary = getMapModifiersSummary();
  addLog(
    `★ Entered [${selectedMapRarity}] ${zone.name} (Tier ${zone.tier} • +${modSummary.quantBonus}% Item Quantity)! Slay ${zone.killTarget} foes to draw out ${zone.bossName}!`,
    "text-amber-300 font-extrabold"
  );
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
  progBarEl.style.width = `${pct}%`;

  const bossAlive = enemies.some(e => e.isBoss);
  if (bossAlive) {
    progTextEl.innerText = `★ BOSS ENGAGED: Slay ${zone.bossName}! ★`;
  } else if (dungeonKills >= zone.killTarget) {
    progTextEl.innerText = `★ Dungeon Cleared (${dungeonKills}/${zone.killTarget}) — Click [Boss] or Re-Queue [M]!`;
  } else {
    progTextEl.innerText = `Dungeon Forces: ${dungeonKills} / ${zone.killTarget} Slain (Spawns ${zone.bossName})`;
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
  const chaosEl = document.getElementById('modal-chaos-count');
  const goldEl = document.getElementById('modal-map-gold');
  const affixBox = document.getElementById('active-map-affixes');
  const listEl = document.getElementById('dungeon-zones-list');
  if (!listEl) return;

  if (chaosEl) chaosEl.innerText = player.chaosOrbs || 0;
  if (goldEl) goldEl.innerText = `${player.gold || 0}g`;

  const modSummary = getMapModifiersSummary();
  const rarityColor = selectedMapRarity === 'Corrupted' ? '#f43f5e'
    : selectedMapRarity === 'Rare' ? '#facc15'
    : selectedMapRarity === 'Magic' ? '#38bdf8' : '#cbd5e1';

  if (affixBox) {
    if (activeMapAffixes.length === 0) {
      affixBox.innerHTML = `<div class="text-slate-400 text-xs">Current Map State: <b class="text-white">Normal (White)</b> — No bonus Path of Exile modifiers active. Click Transmute, Chaos Roll, or Vaal Corrupt above to boost Item Quantity & Rarity!</div>`;
    } else {
      affixBox.innerHTML = `
        <div class="flex justify-between items-center mb-1">
          <span class="font-extrabold text-xs" style="color:${rarityColor}">Active Map State: ${selectedMapRarity} Map (+${modSummary.quantBonus}% EXP, Gold & Item Rarity)</span>
          ${modSummary.twinBoss ? `<span class="text-[10px] bg-rose-900/90 border border-rose-400 text-rose-200 px-2 py-0.5 rounded font-bold">TWIN BOSSES</span>` : ''}
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-indigo-200">
          ${activeMapAffixes.map(a => `<div>• <b class="text-amber-300">${a.name}:</b> ${a.desc}</div>`).join('')}
        </div>
      `;
    }
  }

  listEl.innerHTML = '';
  DUNGEON_ZONES.forEach(zone => {
    const isCurrent = zone.id === activeZoneId;
    const effHp = Math.round(zone.monsterMult * modSummary.hpMult * 100);
    const effDmg = Math.round(zone.monsterMult * modSummary.dmgMult * 100);

    const card = document.createElement('div');
    card.className = `p-3 rounded-xl border-2 transition flex flex-col justify-between bg-slate-900/95 hover:bg-slate-900`;
    card.style.borderColor = isCurrent ? '#facc15' : zone.borderColor;

    card.innerHTML = `
      <div>
        <div class="flex items-center gap-2.5 mb-2">
          <img src="${getRpgIcon(zone.icon)}" class="w-11 h-11 rounded-lg border border-amber-500/50 shrink-0" />
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
          <div class="flex justify-between"><span class="text-slate-400">Monster Power:</span><b class="text-amber-300">${effHp}% HP / ${effDmg}% DMG</b></div>
          <div class="flex justify-between"><span class="text-slate-400">Loot Quantity:</span><b class="text-emerald-300">+${(zone.tier - 1) * 25 + modSummary.quantBonus}% Bonus</b></div>
        </div>
      </div>
      <button onclick="enterDungeonZone('${zone.id}')"
              class="w-full py-2 rounded-lg font-extrabold text-xs transition ${isCurrent ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}">
        ${isCurrent ? 'Re-Instance / Reset Zone' : 'Teleport & Open Instance'}
      </button>
    `;
    listEl.appendChild(card);
  });
}
