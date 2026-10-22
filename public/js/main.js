// ============================================================
// ARCANASTRIDE 3D: MAIN 60FPS GAME LOOP & INITIALIZATION
// ============================================================

function lerpAngle(current, target, t) {
  let diff = ((target - current + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return current + diff * t;
}

function animate(now) {
  requestAnimationFrame(animate);

  sanctuaryMesh.rotation.y += 0.025;
  sanctuaryMesh.position.y = 2.6 + Math.sin(now * 0.003) * 0.25;
  bossGateMesh.rotation.z += 0.02;

  updateCooldownUI(now);

  // Player WASD Movement & Automatic Camera Rotation when pressing [S] or turning with [A]/[D]
  const moveSpeed = 0.34;
  let moveX = 0, moveZ = 0;
  if (keys['w'] || keys['arrowup']) moveZ -= 1;
  if (keys['s'] || keys['arrowdown']) moveZ += 1;
  if (keys['a'] || keys['arrowleft']) moveX -= 1;
  if (keys['d'] || keys['arrowright']) moveX += 1;

  const delta = Math.min(clock.getDelta(), 0.1);
  if (playerMixer) playerMixer.update(delta);
  enemies.forEach(e => { if (e.mixer) e.mixer.update(delta); });
  npcMixers.forEach(m => m.update(delta));

  // Smoothly rotate camera 180° behind the character when [S] is pressed to walk backward/turn around
  if (sTurnTargetYaw !== null) {
    if (moveZ > 0 && moveX !== 0 && sMovementYaw !== null) {
      // Allow smooth left/right steering while holding [S]
      sMovementYaw -= moveX * 0.035;
      sTurnTargetYaw = sMovementYaw + Math.PI;
    }
    cameraYaw = lerpAngle(cameraYaw, sTurnTargetYaw, 0.14);
    let rem = ((sTurnTargetYaw - cameraYaw + Math.PI) % (Math.PI * 2)) - Math.PI;
    if (rem < -Math.PI) rem += Math.PI * 2;
    if (Math.abs(rem) < 0.015 && moveZ <= 0) {
      cameraYaw = sTurnTargetYaw;
      sTurnTargetYaw = null;
    }
  } else if (moveX !== 0 && !isPointerDown) {
    // Smoothly turn camera with the character when steering left/right with [A] or [D]
    cameraYaw -= moveX * 0.032;
  }

  if (moveX !== 0 || moveZ !== 0) {
    const refYaw = (moveZ > 0 && sMovementYaw !== null) ? sMovementYaw : cameraYaw;
    const moveAngle = Math.atan2(moveX, moveZ) + refYaw;
    playerGroup.rotation.y = lerpAngle(playerGroup.rotation.y, moveAngle, 0.24);
    playerGroup.position.x += Math.sin(moveAngle) * moveSpeed;
    playerGroup.position.z += Math.cos(moveAngle) * moveSpeed;
    setPlayerAnim('Run');
  } else {
    setPlayerAnim('Idle');
  }

  // Check Loot Cache Pickups & Bob 2D Treasure Sprites
  const zone = typeof getActiveZoneConfig === 'function' ? getActiveZoneConfig() : (typeof getActiveZone === 'function' ? getActiveZone() : DUNGEON_ZONES[0]);
  const modSummary = typeof getMapModifiersSummary === 'function'
    ? getMapModifiersSummary()
    : { quantMult: 1, quantBonus: 0 };
  const quantMult = Number(modSummary.quantMult) || (1 + (Number(modSummary.quantBonus) || 0) / 100);

  for (let i = caches.length - 1; i >= 0; i--) {
    const c = caches[i];
    if (c.iconSprite) {
      c.iconSprite.position.y = 2.3 + Math.sin(now * 0.004 + i) * 0.25;
    }
    if (playerGroup.position.distanceTo(c.group.position) < 2.9) {
      const tierBonus = Math.max(0, Number(zone.lootTierBonus ?? (zone.tier ? zone.tier - 1 : 0)) || 0);
      const goldGain = Math.max(15, Math.round((18 + Math.floor(Math.random() * 26)) * (tierBonus + 1) * quantMult));
      player.gold = Math.max(0, (Number(player.gold) || 0) + goldGain);
      createBurst(c.group.position, 0xfacc15, 16);
      spawnFloatingText(c.group.position, `+${goldGain} GOLD`, "#fde047");
      addLog(`Opened Runed Chest! Found ${goldGain} Gold.`, "text-yellow-300");

      if (Math.random() < Math.min(0.95, 0.55 * quantMult) && (player.inventory || []).length < 16) {
        const chestLoot = generateLootDrop(tierBonus + 1);
        player.inventory.push(chestLoot);
        addLog(`★ CHEST TREASURE: Looted [${chestLoot.rarity}] ${chestLoot.name}! Open [I] to equip!`, "text-amber-300 font-bold");
      }

      if (Math.random() < 0.25 * quantMult) {
        player.chaosOrbs = Math.max(0, (Number(player.chaosOrbs) || 0) + 1);
        addLog(`★ ATLAS CURRENCY: Chest contained +1 Chaos Orb! (Total: ${player.chaosOrbs})`, "text-amber-400 font-extrabold");
      }

      scene.remove(c.group);
      caches.splice(i, 1);
      setTimeout(spawnCache, 9000);
      updateHUD();
      syncSave();
    }
  }

  // MMORPG Target Ground Projector Ring Update
  if (currentTargetEnemy && enemies.includes(currentTargetEnemy) && currentTargetEnemy.hp > 0) {
    if (targetGroundRing) {
      targetGroundRing.visible = true;
      targetGroundRing.position.set(currentTargetEnemy.group.position.x, 0.06, currentTargetEnemy.group.position.z);
      targetGroundRing.rotation.z += 0.02;
      const s = (currentTargetEnemy.scale || 1.0) * (currentTargetEnemy.isBoss ? 1.5 : 1.0);
      targetGroundRing.scale.set(s, s, s);
    }
  } else {
    if (targetGroundRing) targetGroundRing.visible = false;
    if (currentTargetEnemy) clearTargetEnemy();
  }

  // Enemy AI, Flocking Avoidance & Billboard Healthbars
  const derived = getDerivedStats();
  enemies.forEach(e => {
    e.hpBg.lookAt(camera.position);
    e.hpFg.lookAt(camera.position);
    const dist = e.group.position.distanceTo(playerGroup.position);
    const aggroRange = e.isBoss ? 36 : 28;

    const atkRange = e.atkRange || (e.isRanged ? 15.0 : (e.isBoss ? 4.2 : 3.4));
    const stopDist = e.stopDist || (e.isRanged ? 8.5 : 2.2);

    if (dist < aggroRange && dist > stopDist) {
      const toPlayer = new THREE.Vector3().subVectors(playerGroup.position, e.group.position);
      toPlayer.y = 0;
      toPlayer.normalize();

      // Flocking / crowd repulsion from nearby monsters to prevent stacking while pursuing
      let repulseX = 0, repulseZ = 0;
      for (let j = 0; j < enemies.length; j++) {
        const other = enemies[j];
        if (other === e) continue;
        const diffX = e.group.position.x - other.group.position.x;
        const diffZ = e.group.position.z - other.group.position.z;
        const d2 = diffX * diffX + diffZ * diffZ;
        const minD = (e.radius || 1.3) + (other.radius || 1.3) + 1.2;
        if (d2 < minD * minD && d2 > 0.001) {
          const d = Math.sqrt(d2);
          const str = (minD - d) / minD;
          repulseX += (diffX / d) * str * 1.6;
          repulseZ += (diffZ / d) * str * 1.6;
        }
      }

      const moveDir = new THREE.Vector3(toPlayer.x + repulseX, 0, toPlayer.z + repulseZ);
      if (moveDir.lengthSq() > 0.001) moveDir.normalize();

      const baseSpd = e.isBoss ? 0.155 : 0.125;
      e.group.position.addScaledVector(moveDir, baseSpd * (e.speedMult || 1));
      e.group.lookAt(playerGroup.position.x, 0, playerGroup.position.z);
      setEnemyAnim(e, 'walk');
    } else if (dist <= atkRange && now - (e.lastHitPlayer || 0) > (e.atkCooldown || 1200)) {
      e.lastHitPlayer = now;
      e.group.lookAt(playerGroup.position.x, 0, playerGroup.position.z);
      setEnemyAnim(e, 'attack', 600);

      const zone = typeof getActiveZoneConfig === 'function' ? getActiveZoneConfig() : DUNGEON_ZONES[0];
      const modSummary = typeof getMapModifiersSummary === 'function' ? getMapModifiersSummary() : { dmgMult: 1 };
      const zoneMult = (zone && zone.monsterMult) || 1.0;
      const effAtk = Math.round((e.atk || 16) * zoneMult * (modSummary.dmgMult || 1.0));
      // RPG armor mitigation formula: ensures noticeable damage regardless of defense stacking
      const defReduction = 100 / (100 + Math.max(0, derived.totalDef) * 0.7);
      const dmg = Math.max(2, Math.round(effAtk * defReduction) + Math.floor(Math.random() * 4));

      player.hp = Math.max(0, player.hp - dmg);
      createBurst(playerGroup.position, e.isBoss ? 0xf43f5e : (e.isRanged ? 0xc084fc : 0xef4444), 9);
      spawnFloatingText(playerGroup.position, `-${dmg}`, e.isBoss ? "#fb7185" : "#f87171");

      if (e.isRanged) {
        createBurst(e.group.position, 0xc084fc, 8);
      }

      if (player.hp <= 0) {
        const lostGold = Math.floor((player.gold || 0) * 0.15);
        player.gold = Math.max(0, (player.gold || 0) - lostGold);
        player.hp = Math.round(derived.calcMaxHp * 0.6);
        playerGroup.position.set(0, 0, 18);
        playerGroup.rotation.y = Math.PI;
        addLog(`You fell in combat against ${e.name}! Emergency warp to Outpost Nexus (-${lostGold}g).`, "text-rose-500 font-bold");
      }
      updateHUD();
      syncSave();
    } else {
      e.group.lookAt(playerGroup.position.x, 0, playerGroup.position.z);
      setEnemyAnim(e, 'idle');
    }
  });

  // Physical separation: ensure monsters never stack on top of each other
  for (let iter = 0; iter < 2; iter++) {
    for (let i = 0; i < enemies.length; i++) {
      const e1 = enemies[i];
      const r1 = e1.radius || 1.3;
      for (let j = i + 1; j < enemies.length; j++) {
        const e2 = enemies[j];
        const r2 = e2.radius || 1.3;
        const minDist = r1 + r2;
        const dx = e1.group.position.x - e2.group.position.x;
        const dz = e1.group.position.z - e2.group.position.z;
        const d2 = dx * dx + dz * dz;
        if (d2 < minDist * minDist) {
          const d = Math.max(0.001, Math.sqrt(d2));
          const overlap = minDist - d;
          const nx = dx / d;
          const nz = dz / d;
          const w1 = e1.isBoss ? 0.15 : 0.5;
          const w2 = e2.isBoss ? 0.15 : 0.5;
          const sum = w1 + w2;
          e1.group.position.x += nx * overlap * (w2 / sum);
          e1.group.position.z += nz * overlap * (w2 / sum);
          e2.group.position.x -= nx * overlap * (w1 / sum);
          e2.group.position.z -= nz * overlap * (w1 / sum);
        }
      }
    }
  }

  // Prevent enemies from penetrating inside player coordinates (allow them within melee reach 1.35m)
  enemies.forEach(e => {
    const pDist = e.group.position.distanceTo(playerGroup.position);
    const minPlayerDist = 1.35;
    if (pDist < minPlayerDist && pDist > 0.001) {
      const pushOut = new THREE.Vector3().subVectors(e.group.position, playerGroup.position).normalize();
      e.group.position.addScaledVector(pushOut, minPlayerDist - pDist);
    }
    e.group.position.y = 0;
  });

  // Update Slash Waves
  for (let i = slashWaves.length - 1; i >= 0; i--) {
    const sw = slashWaves[i];
    const scaleStep = sw.isSkill ? 1.18 : 1.12;
    sw.mesh.scale.multiplyScalar(scaleStep);
    sw.mesh.material.opacity *= 0.86;
    sw.life -= 1;
    if (sw.life <= 0) {
      scene.remove(sw.mesh);
      slashWaves.splice(i, 1);
    }
  }

  // Update Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.mesh.position.add(p.vel);
    p.life -= 1;
    if (p.life <= 0) {
      scene.remove(p.mesh);
      particles.splice(i, 1);
    }
  }

  // Contextual Interaction Prompt
  const promptEl = document.getElementById('interact-prompt');
  if (playerGroup.position.distanceTo(sanctuaryPos) < 7) {
    promptEl.innerText = "Press [E] Rest at Sanctuary Shrine (15g)";
    promptEl.classList.remove('hidden');
  } else if (playerGroup.position.distanceTo(shopPos) < 7) {
    promptEl.innerText = "Press [E] or [P] Trade with Nomadic Quartermaster";
    promptEl.classList.remove('hidden');
  } else if (playerGroup.position.distanceTo(bossGatePos) < 12) {
    promptEl.innerText = `Press [E] Summon ${zone.bossName}`;
    promptEl.classList.remove('hidden');
  } else {
    promptEl.classList.add('hidden');
  }

  // Third-Person Orbital Camera Follow
  const camDist = 16;
  const targetCamX = playerGroup.position.x + Math.sin(cameraYaw) * camDist * Math.cos(cameraPitch);
  const targetCamZ = playerGroup.position.z + Math.cos(cameraYaw) * camDist * Math.cos(cameraPitch);
  const targetCamY = playerGroup.position.y + Math.sin(cameraPitch) * camDist + 1.8;

  camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.16);
  camera.lookAt(playerGroup.position.x, playerGroup.position.y + 2.0, playerGroup.position.z);

  drawMinimap();
  renderer.render(scene, camera);
}

async function init() {
  // Immediately populate all static [data-rpg-icon] <img> elements on buttons & modals
  hydrateStaticIcons();

  const res = await fetch('/api/state');
  player = await res.json();
  playerGroup.position.set(player.x || 0, 0, player.z || 18);
  playerGroup.rotation.y = Math.PI;

  // Load Hero 3D Model first so it gets 100% network priority
  applyArchetypeVisuals(player.className, player.heroSkin);
  populateWorld();
  updateHUD();
  requestAnimationFrame(animate);

  // Load world buildings, props, and enemy GLB rigs right after hero request starts
  setTimeout(preloadWorldAndEnemyModels, 120);
}

init();
