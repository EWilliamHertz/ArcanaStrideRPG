// ============================================================
// ARCANASTRIDE 3D: COMBAT ENGINE, SKILLS, CONSUMABLES & LEVELING
// ============================================================

function spawnFloatingText(worldPos, text, color = "#facc15") {
  const vector = worldPos.clone();
  vector.y += 2.5;
  vector.project(camera);
  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;

  const el = document.createElement('div');
  el.className = 'dmg-text text-base';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.color = color;
  el.innerText = text;
  document.getElementById('floating-container').appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function createBurst(pos, colorHex, count = 12, emoji = null) {
  for (let i = 0; i < count; i++) {
    let p;
    if (emoji && i % 3 === 0) {
      p = createIconSprite(emoji, '#' + colorHex.toString(16).padStart(6, '0'), 0.95);
    } else {
      const geo = new THREE.SphereGeometry(0.18, 6, 6);
      const mat = new THREE.MeshBasicMaterial({ color: colorHex });
      p = new THREE.Mesh(geo, mat);
    }
    p.position.copy(pos);
    p.position.y += 1.3;
    scene.add(p);
    particles.push({
      mesh: p,
      vel: new THREE.Vector3((Math.random() - 0.5) * 0.36, 0.08 + Math.random() * 0.28, (Math.random() - 0.5) * 0.36),
      life: 26
    });
  }
}

function spawnSlashWave(colorHex = 0x38bdf8, isWideAoE = false) {
  const ringGeo = isWideAoE
    ? new THREE.RingGeometry(1.2, 2.6, 32)
    : new THREE.RingGeometry(0.8, 1.9, 24, 1, -Math.PI * 0.4, Math.PI * 0.8);
  const ringMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.88
  });
  const wave = new THREE.Mesh(ringGeo, ringMat);
  wave.rotation.x = -Math.PI / 2;
  wave.rotation.z = playerGroup.rotation.y;
  wave.position.copy(playerGroup.position);
  wave.position.y = 1.25;
  scene.add(wave);
  slashWaves.push({ mesh: wave, isSkill: isWideAoE, life: 14 });
}

function isActionOnCooldown(actionId) {
  const cd = actionCooldowns[actionId];
  return cd && performance.now() < cd.end;
}

function startActionCooldown(actionId, durationMs) {
  const now = performance.now();
  actionCooldowns[actionId] = {
    start: now,
    end: now + durationMs,
    duration: durationMs
  };
}

function checkLevelUp() {
  let leveled = false;
  while (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    player.level += 1;
    player.xpToNext = Math.floor(player.xpToNext * 1.42);
    player.maxHp += 20;
    player.maxMp += 10;
    player.atk += 4;
    player.def += 2;
    player.statPoints = (player.statPoints || 0) + 5;
    player.skillPoints = (player.skillPoints || 0) + 1;
    leveled = true;
  }
  if (leveled) {
    const derived = getDerivedStats();
    player.hp = derived.calcMaxHp;
    player.mp = derived.calcMaxMp;
    setPlayerAnim('Use', 600);
    addLog(`★ LEVEL UP! Ascended to Lv.${player.level}! Gained +5 Attribute Pts & +1 Skill Pt (Press [O])!`, "text-yellow-300 font-bold");
    createBurst(playerGroup.position, 0xfacc15, 28);
    spawnFloatingText(playerGroup.position, `LEVEL ${player.level}! (+5 STAT / +1 SKILL)`, "#fde047");
    if (!document.getElementById('stats-modal').classList.contains('hidden')) {
      renderStatsModal();
    }
  }
}

function triggerActionSlot(slotIdx) {
  if (!player.actionBar) return;
  const actionId = player.actionBar[slotIdx];
  if (!actionId) return;

  const slotEl = document.querySelector(`[data-slot-idx="${slotIdx}"]`);
  if (slotEl) {
    slotEl.classList.add('slot-active');
    setTimeout(() => slotEl.classList.remove('slot-active'), 120);
  }
  triggerActionById(actionId);
}

function triggerActionById(actionId) {
  const meta = ACTION_CATALOG[actionId];
  if (!meta) return;

  if (isActionOnCooldown(actionId)) return;

  if (actionId === 'potion') return usePotion();
  if (actionId === 'ether') return useEther();
  if (actionId === 'elixir') return useElixir();

  executeSkill(actionId);
}

function executeSkill(skillId) {
  const meta = ACTION_CATALOG[skillId] || ACTION_CATALOG.slash;
  const derived = getDerivedStats();

  if (player.mp < meta.mpCost) {
    addLog(`Not enough Mana for ${meta.name} (${meta.mpCost} MP required)!`, "text-rose-400");
    spawnFloatingText(playerGroup.position, "Need Mana!", "#60a5fa");
    return;
  }

  player.mp = Math.max(0, player.mp - meta.mpCost);
  startActionCooldown(skillId, meta.cooldownMs);

  const skillRank = (player.skills && player.skills[skillId]) || 1;
  const rankBonusMult = 1 + (skillRank - 1) * 0.20;
  const spellScaling = skillId === 'slash' ? 1.0 : (1 + derived.spellPowerPct / 200);

  // Special Movement / Self-Heal effects per skill
  if (skillId === 'phantom_dash') {
    const forward = new THREE.Vector3(Math.sin(playerGroup.rotation.y), 0, Math.cos(playerGroup.rotation.y));
    playerGroup.position.addScaledVector(forward, 8.0);
    createBurst(playerGroup.position, 0x34d399, 14);
  } else if (skillId === 'holy_nova') {
    const healAmt = Math.round(derived.calcMaxHp * (0.28 + skillRank * 0.04));
    player.hp = Math.min(derived.calcMaxHp, player.hp + healAmt);
    createBurst(playerGroup.position, 0xfde047, 20);
    spawnFloatingText(playerGroup.position, `+${healAmt} HP`, "#4ade80");
  } else if (skillId !== 'slash') {
    createBurst(playerGroup.position, meta.waveColor, 18);
  }

  setPlayerAnim(meta.anim || 'Attack', skillId === 'slash' ? 400 : 540);
  spawnSlashWave(meta.waveColor, skillId !== 'slash');

  swordMesh.rotation.x = Math.PI / 1.4;
  setTimeout(() => { swordMesh.rotation.x = Math.PI / 4; }, 180);

  let hitCount = 0;
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    const dist = playerGroup.position.distanceTo(e.group.position);
    if (dist <= meta.range) {
      hitCount++;
      const effDef = skillId === 'whirlwind' ? e.def * 0.55 : e.def;
      let dmg = Math.max(3, Math.round(derived.totalAtk * meta.baseMult * rankBonusMult * spellScaling - effDef + Math.random() * 6));

      const isCrit = skillId === 'crimson_fury' || (Math.random() * 100 < derived.critChance);
      if (isCrit) {
        dmg = Math.round(dmg * 1.75);
      }

      if (skillId === 'aether_bolt') {
        const leech = Math.round(derived.calcMaxHp * 0.10);
        player.hp = Math.min(derived.calcMaxHp, player.hp + leech);
      } else if (skillId === 'aegis_slam' && hitCount === 1) {
        player.def += 1;
      }

      e.hp = Math.max(0, e.hp - dmg);
      e.hpFg.scale.x = Math.max(0.01, e.hp / e.maxHp);

      if (!currentTargetEnemy) {
        setTargetEnemy(e);
      } else if (currentTargetEnemy === e) {
        updateTargetHUD();
      }

      createBurst(e.group.position, meta.waveColor, 10);
      spawnFloatingText(
        e.group.position,
        isCrit ? `CRIT -${dmg}!` : `-${dmg}`,
        isCrit ? "#fde047" : (skillId === 'slash' ? "#38bdf8" : "#f0abfc")
      );

      if (e.hp <= 0) {
        handleEnemyDefeat(e, i);
      }
    }
  }

  if (hitCount === 0 && skillId !== 'slash' && skillId !== 'holy_nova' && skillId !== 'phantom_dash') {
    addLog(`Unleashed ${meta.name} (Lv.${skillRank}), but no foes were within ${meta.range}m.`, "text-slate-400");
  }

  updateHUD();
  syncSave();
}

function handleEnemyDefeat(e, index) {
  const earnedGold = Math.max(0, Number(e.gold) || 0);
  const earnedXp = Math.max(0, Number(e.xp) || 0);
  player.gold = Math.max(0, (Number(player.gold) || 0) + earnedGold);
  player.xp = Math.max(0, (Number(player.xp) || 0) + earnedXp);
  createBurst(e.group.position, 0xfacc15, 14);
  addLog(`Slain ${e.name}! +${earnedGold}g | +${earnedXp} EXP`, "text-emerald-400 font-semibold");

  const zone = typeof getActiveZoneConfig === 'function' ? getActiveZoneConfig() : DUNGEON_ZONES[0];
  const modSummary = typeof getMapModifiersSummary === 'function' ? getMapModifiersSummary() : { quantBonus: 0, quantMult: 1 };
  const quantMult = Number(modSummary.quantMult) || (1 + (Number(modSummary.quantBonus) || 0) / 100);

  // Chance to drop Path of Exile Chaos Orb
  if (e.isBoss || Math.random() < 0.22 * quantMult) {
    player.chaosOrbs = Math.max(0, (Number(player.chaosOrbs) || 0) + (e.isBoss ? 2 : 1));
    addLog(`★ ATLAS CURRENCY: Looted ${e.isBoss ? '2x ' : ''}Chaos Orb! Use in [M] Map Device to roll Rare Maps!`, "text-yellow-300 font-bold");
    spawnFloatingText(e.group.position, "+CHAOS ORB!", "#facc15");
  }

  // Drop Diablo/PoE Wargear into [I] Inventory
  const dropChance = e.isBoss ? 1.0 : Math.min(0.90, 0.38 * quantMult);
  if (Math.random() < dropChance) {
    const tierBonus = Math.max(0, Number(zone.lootTierBonus ?? (zone.tier ? zone.tier - 1 : 0)) || 0)
      + (e.isBoss ? 2 : 0)
      + (selectedMapRarity === 'Corrupted' ? 2 : selectedMapRarity === 'Rare' ? 1 : 0);
    const dropped = generateLootDrop(tierBonus);
    if ((player.inventory || []).length < 16) {
      player.inventory.push(dropped);
      addLog(`★ LOOT DROP: Found [${dropped.rarity}] ${dropped.name}! Press [I] to equip!`, "text-amber-300 font-bold");
      spawnFloatingText(e.group.position, `${dropped.name}`, dropped.color);
      if (!document.getElementById('inventory-modal').classList.contains('hidden')) {
        renderInventoryModal();
      }
    }
  }

  if (currentTargetEnemy === e) {
    clearTargetEnemy();
  }
  scene.remove(e.group);
  enemies.splice(index, 1);

  if (e.isBoss) {
    player.floor = Math.max(player.floor || 1, zone.tier + 1);
    addLog(`★★★ DUNGEON BOSS VANQUISHED: ${e.name} has fallen! Atlas Tier advanced to ${player.floor}! ★★★`, "text-fuchsia-400 font-extrabold");
  } else {
    dungeonKills += 1;
    if (!dungeonBossSpawned && dungeonKills >= zone.killTarget) {
      summonZoneBossNow();
    }
    setTimeout(() => spawnEnemy(false), 6000);
  }
  if (typeof updateDungeonTrackerUI === 'function') {
    updateDungeonTrackerUI();
  }
  checkLevelUp();
}

function usePotion() {
  if (isActionOnCooldown('potion')) return;
  if (player.potions <= 0) return addLog("Out of Crimson Health Potions!", "text-rose-400");
  const derived = getDerivedStats();
  player.potions -= 1;
  startActionCooldown('potion', ACTION_CATALOG.potion.cooldownMs);
  const heal = Math.round(derived.calcMaxHp * 0.45);
  player.hp = Math.min(derived.calcMaxHp, player.hp + heal);
  setPlayerAnim('Use', 450);
  createBurst(playerGroup.position, 0x22c55e, 15);
  spawnFloatingText(playerGroup.position, `+${heal} HP`, "#4ade80");
  addLog(`Drank Crimson Health Potion (+${heal} HP).`, "text-emerald-400");
  updateHUD();
  syncSave();
}

function useEther() {
  if (isActionOnCooldown('ether')) return;
  if (player.ethers <= 0) return addLog("Out of Azure Mana Ethers!", "text-rose-400");
  const derived = getDerivedStats();
  player.ethers -= 1;
  startActionCooldown('ether', ACTION_CATALOG.ether.cooldownMs);
  const restore = Math.round(derived.calcMaxMp * 0.5);
  player.mp = Math.min(derived.calcMaxMp, player.mp + restore);
  setPlayerAnim('Use', 450);
  createBurst(playerGroup.position, 0x3b82f6, 15);
  spawnFloatingText(playerGroup.position, `+${restore} MP`, "#60a5fa");
  addLog(`Drank Azure Mana Ether (+${restore} MP).`, "text-blue-400");
  updateHUD();
  syncSave();
}

function useElixir() {
  if (isActionOnCooldown('elixir')) return;
  if ((player.elixirs || 0) <= 0) return addLog("Out of Elixirs of Blood Fury!", "text-rose-400");
  player.elixirs -= 1;
  startActionCooldown('elixir', ACTION_CATALOG.elixir.cooldownMs);
  furyBuffUntil = performance.now() + 20000;
  setPlayerAnim('Use', 500);
  createBurst(playerGroup.position, 0xf43f5e, 22);
  spawnFloatingText(playerGroup.position, "BLOOD FURY (+35% ATK)!", "#fb7185");
  addLog("Consumed Elixir of Blood Fury! +35% ATK & +20% Crit for 20 seconds!", "text-rose-400 font-bold");
  updateHUD();
  syncSave();
}

function dashMove() {
  triggerActionById('phantom_dash');
}
