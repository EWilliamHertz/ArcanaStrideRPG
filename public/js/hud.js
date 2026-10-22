// ============================================================
// ARCANASTRIDE 3D: HUD, GLOBES, MINIMAP, LOGGING & SAVE SYNC
// ============================================================

function addLog(msg, colorClass = "text-slate-200") {
  const log = document.getElementById('combat-log');
  if (!log) return;
  const div = document.createElement('div');
  div.className = colorClass;
  div.innerHTML = "> " + msg;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function hydrateStaticIcons() {
  document.querySelectorAll('img[data-rpg-icon]').forEach(img => {
    const key = img.getAttribute('data-rpg-icon');
    if (key) {
      img.src = getRpgIcon(key);
    }
  });
}

function updateHUD() {
  if (typeof player.gold !== 'number' || isNaN(player.gold) || player.gold < 0) {
    player.gold = 0;
  }
  if (typeof player.chaosOrbs !== 'number' || isNaN(player.chaosOrbs) || player.chaosOrbs < 0) {
    player.chaosOrbs = 0;
  }
  const derived = getDerivedStats();
  player.hp = Math.min(player.hp, derived.calcMaxHp);
  player.mp = Math.min(player.mp, derived.calcMaxMp);

  document.getElementById('hud-name').innerText = player.name || 'Traveler';
  document.getElementById('hud-level-badge').innerText = player.level || 1;
  document.getElementById('hud-class').innerText = `Lv.${player.level} ${player.className} • Tier ${player.floor || 1}`;
  document.getElementById('hud-gold').innerText = `${player.gold || 0}g`;
  const chaosEl = document.getElementById('hud-chaos');
  if (chaosEl) chaosEl.innerText = `${player.chaosOrbs ?? 3}c`;

  const hpPct = Math.max(0, Math.min(100, (player.hp / derived.calcMaxHp) * 100));
  const mpPct = Math.max(0, Math.min(100, (player.mp / derived.calcMaxMp) * 100));
  const xpPct = Math.max(0, Math.min(100, (player.xp / player.xpToNext) * 100));

  document.getElementById('hud-hp-text').innerText = `${player.hp} / ${derived.calcMaxHp}`;
  document.getElementById('hud-hp-bar').style.width = `${hpPct}%`;
  document.getElementById('hud-mp-text').innerText = `${player.mp} / ${derived.calcMaxMp}`;
  document.getElementById('hud-mp-bar').style.width = `${mpPct}%`;
  document.getElementById('hud-xp-text').innerText = `EXP ${player.xp} / ${player.xpToNext} (Lv.${player.level})`;
  document.getElementById('hud-xp-bar').style.width = `${xpPct}%`;

  // Update Diablo Health & Mana Orbs on Bottom Dock
  const orbHpFill = document.getElementById('orb-hp-fill');
  const orbMpFill = document.getElementById('orb-mp-fill');
  if (orbHpFill) orbHpFill.style.height = `${hpPct}%`;
  if (orbMpFill) orbMpFill.style.height = `${mpPct}%`;
  document.getElementById('orb-hp-val').innerText = player.hp;
  document.getElementById('orb-mp-val').innerText = player.mp;

  // Quick Combat Ratings
  document.getElementById('hud-atk').innerText = derived.totalAtk;
  document.getElementById('hud-def').innerText = derived.totalDef;
  document.getElementById('hud-crit').innerText = `${derived.critChance}%`;
  document.getElementById('hud-potions').innerText = player.potions || 0;
  document.getElementById('hud-ethers').innerText = player.ethers || 0;

  // Fury Buff Badge
  const buffBadge = document.getElementById('hud-buff-badge');
  if (buffBadge) {
    if (derived.isFuryActive) buffBadge.classList.remove('hidden');
    else buffBadge.classList.add('hidden');
  }

  // Unspent Attribute + Skill Points Badges
  const totalUnspent = (player.statPoints || 0) + (player.skillPoints || 0);
  const topBadge = document.getElementById('top-unspent-badge');
  const dockDot = document.getElementById('dock-unspent-dot');
  if (topBadge) {
    topBadge.innerText = totalUnspent;
    topBadge.style.display = totalUnspent > 0 ? 'inline-block' : 'none';
  }
  if (dockDot) {
    if (totalUnspent > 0) dockDot.classList.remove('hidden');
    else dockDot.classList.add('hidden');
  }

  if (typeof updateDungeonTrackerUI === 'function') {
    updateDungeonTrackerUI();
  }
  renderActionBar();
}

async function syncSave() {
  player.x = Math.round(playerGroup.position.x);
  player.z = Math.round(playerGroup.position.z);
  try {
    await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player)
    });
  } catch (e) {}
}

async function resetCharacter() {
  const res = await fetch('/api/reset', { method: 'POST' });
  player = await res.json();
  playerGroup.position.set(player.x, 0, player.z);
  playerGroup.rotation.y = Math.PI;
  applyArchetypeVisuals(player.className, player.heroSkin);
  populateWorld();
  updateHUD();
  addLog("Character save reset to Level 1.", "text-amber-400");
}

// Minimap Radar Renderer
const mapCanvas = document.getElementById('minimap');
const mapCtx = mapCanvas.getContext('2d');

function drawMinimap() {
  mapCtx.clearRect(0, 0, 136, 136);
  const cx = 68, cy = 68, scale = 0.55;

  const coordsEl = document.getElementById('hud-coords');
  if (coordsEl) {
    coordsEl.innerText = `${Math.round(playerGroup.position.x)}, ${Math.round(playerGroup.position.z)}`;
  }

  // Outpost & Boss Gate markers
  mapCtx.fillStyle = '#fbbf24';
  mapCtx.fillRect(cx + (shopPos.x - playerGroup.position.x) * scale - 3, cy + (shopPos.z - playerGroup.position.z) * scale - 3, 6, 6);
  mapCtx.fillStyle = '#10b981';
  mapCtx.fillRect(cx + (sanctuaryPos.x - playerGroup.position.x) * scale - 3, cy + (sanctuaryPos.z - playerGroup.position.z) * scale - 3, 6, 6);
  mapCtx.fillStyle = '#f43f5e';
  mapCtx.beginPath();
  mapCtx.arc(cx + (bossGatePos.x - playerGroup.position.x) * scale, cy + (bossGatePos.z - playerGroup.position.z) * scale, 5, 0, Math.PI * 2);
  mapCtx.fill();

  // Loot Caches
  caches.forEach(c => {
    const dx = (c.group.position.x - playerGroup.position.x) * scale;
    const dz = (c.group.position.z - playerGroup.position.z) * scale;
    if (Math.abs(dx) < 64 && Math.abs(dz) < 64) {
      mapCtx.fillStyle = '#facc15';
      mapCtx.fillRect(cx + dx - 2, cy + dz - 2, 4, 4);
    }
  });

  // Enemies
  enemies.forEach(e => {
    const dx = (e.group.position.x - playerGroup.position.x) * scale;
    const dz = (e.group.position.z - playerGroup.position.z) * scale;
    if (Math.abs(dx) < 64 && Math.abs(dz) < 64) {
      mapCtx.fillStyle = e.isBoss ? '#f43f5e' : '#ef4444';
      mapCtx.fillRect(cx + dx - 2.5, cy + dz - 2.5, 5, 5);
    }
  });

  // Player center dot
  mapCtx.fillStyle = '#22d3ee';
  mapCtx.beginPath();
  mapCtx.arc(cx, cy, 4, 0, Math.PI * 2);
  mapCtx.fill();
}

function setTargetEnemy(enemy) {
  if (!enemy) return;
  currentTargetEnemy = enemy;
  updateTargetHUD();
}

function updateTargetHUD() {
  const frame = document.getElementById('target-unit-frame');
  if (!frame) return;

  if (!currentTargetEnemy || !enemies.includes(currentTargetEnemy) || currentTargetEnemy.hp <= 0) {
    frame.classList.add('hidden');
    if (currentTargetEnemy && currentTargetEnemy.hp <= 0) {
      currentTargetEnemy = null;
    }
    return;
  }

  frame.classList.remove('hidden');
  const e = currentTargetEnemy;

  const nameEl = document.getElementById('target-name');
  const avatarEl = document.getElementById('target-avatar-img');
  const badgeEl = document.getElementById('target-badge');
  const subtitleEl = document.getElementById('target-subtitle');
  const hpTextEl = document.getElementById('target-hp-text');
  const hpBarEl = document.getElementById('target-hp-bar');

  if (nameEl) nameEl.innerText = e.name || 'Monster';
  if (avatarEl && typeof getMonsterAvatar === 'function') {
    avatarEl.src = getMonsterAvatar(e);
  }
  if (badgeEl) {
    badgeEl.innerText = e.isBoss ? 'BOSS' : 'FOE';
    badgeEl.className = e.isBoss
      ? 'text-[9px] bg-rose-600 text-white font-black px-1.5 py-0.5 rounded border border-rose-300 animate-pulse'
      : 'text-[9px] bg-amber-600/90 text-white font-bold px-1 rounded border border-amber-400';
  }
  if (subtitleEl) {
    const zone = typeof getActiveZone === 'function' ? getActiveZone() : { tier: 1 };
    subtitleEl.innerText = e.isBoss ? `Tier ${zone.tier} • Dungeon Boss` : `Tier ${zone.tier} • Hostile`;
  }

  const pct = Math.max(0, Math.min(100, (e.hp / e.maxHp) * 100));
  if (hpTextEl) {
    hpTextEl.innerText = `${Math.max(0, e.hp)} / ${e.maxHp} (${Math.round(pct)}%)`;
  }
  if (hpBarEl) {
    hpBarEl.style.width = `${pct}%`;
    if (e.isBoss) {
      hpBarEl.className = 'bg-gradient-to-r from-red-700 via-rose-500 to-amber-300 h-full transition-all duration-150';
    } else {
      hpBarEl.className = 'bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 h-full transition-all duration-150';
    }
  }
}

function clearTargetEnemy() {
  currentTargetEnemy = null;
  const frame = document.getElementById('target-unit-frame');
  if (frame) frame.classList.add('hidden');
  if (targetGroundRing) targetGroundRing.visible = false;
}

