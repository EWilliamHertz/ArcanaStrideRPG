// ============================================================
// ARCANASTRIDE 3D: [O] ATTRIBUTES, SKILL TREE & KEYBIND EDITOR
// ============================================================

function toggleStatsModal() {
  const modal = document.getElementById('stats-modal');
  if (!modal) return;
  const isHidden = modal.classList.contains('hidden');
  if (isHidden) {
    document.getElementById('inventory-modal').classList.add('hidden');
    const dm = document.getElementById('dungeon-modal');
    if (dm) dm.classList.add('hidden');
    renderStatsModal();
    modal.classList.remove('hidden');
  } else {
    listeningForSlotKeybind = null;
    modal.classList.add('hidden');
  }
}

function allocateStat(statKey, amount = 1) {
  const avail = player.statPoints || 0;
  if (avail <= 0) {
    addLog("No unspent Attribute Points! Level up in combat to earn +5 points per level.", "text-rose-400");
    return;
  }
  const spend = Math.min(avail, amount);
  player.statPoints -= spend;
  player[statKey] = (player[statKey] || 10) + spend;

  const derived = getDerivedStats();
  if (statKey === 'vit') {
    player.hp = Math.min(derived.calcMaxHp, player.hp + spend * 15);
  } else if (statKey === 'int') {
    player.mp = Math.min(derived.calcMaxMp, player.mp + spend * 10);
  }

  addLog(`Allocated +${spend} to ${statKey.toUpperCase()}!`, "text-amber-300 font-bold");
  updateHUD();
  renderStatsModal();
  syncSave();
}

function upgradeSkillRank(skillId) {
  if ((player.skillPoints || 0) <= 0) {
    addLog("No unspent Skill Points! Level up to earn +1 Skill Point per level.", "text-rose-400");
    return;
  }
  if (!player.skills) player.skills = {};
  const currentRank = player.skills[skillId] || 1;
  if (currentRank >= 10) {
    addLog("This skill has reached Maximum Mastery Rank (Rank 10)!", "text-amber-300");
    return;
  }
  player.skillPoints -= 1;
  player.skills[skillId] = currentRank + 1;

  const meta = ACTION_CATALOG[skillId];
  addLog(`★ Upgraded [${meta ? meta.name : skillId}] to Rank ${player.skills[skillId]} (+20% Power)!`, "text-cyan-300 font-bold");
  updateHUD();
  renderStatsModal();
  syncSave();
}

function respecCharacter() {
  const lvl = Math.max(1, player.level || 1);
  player.str = 10;
  player.dex = 10;
  player.vit = 10;
  player.int = 10;
  player.statPoints = lvl * 5;
  player.skillPoints = lvl + 1;
  player.skills = {
    slash: 1,
    whirlwind: 1,
    aether_bolt: 1,
    aegis_slam: 1,
    crimson_fury: 1,
    holy_nova: 1,
    phantom_dash: 1
  };
  const derived = getDerivedStats();
  player.hp = Math.min(player.hp, derived.calcMaxHp);
  player.mp = Math.min(player.mp, derived.calcMaxMp);
  addLog(`Refunded all Attribute Points (${player.statPoints}) and Skill Points (${player.skillPoints})!`, "text-amber-300 font-bold");
  updateHUD();
  renderStatsModal();
  syncSave();
}

function assignSkillToSlot(skillId, slotIdx) {
  const idx = parseInt(slotIdx, 10);
  if (isNaN(idx) || idx < 0 || idx >= 10) return;
  player.actionBar[idx] = skillId;
  const meta = ACTION_CATALOG[skillId];
  const keyLabel = (player.keybinds && player.keybinds[idx]) || String(idx + 1);
  addLog(`Bound [${meta.name}] to Slot #${idx + 1} (Key [${keyLabel}])!`, "text-cyan-300 font-bold");
  renderActionBar();
  renderStatsModal();
  syncSave();
}

function startKeybindCapture(slotIdx) {
  listeningForSlotKeybind = slotIdx;
  renderStatsModal();
}

function renderStatsModal() {
  const derived = getDerivedStats();
  document.getElementById('modal-stat-points').innerText = player.statPoints || 0;
  document.getElementById('modal-skill-points').innerText = player.skillPoints || 0;

  document.getElementById('stat-str-val').innerText = `${player.str || 10}${derived.gearStr ? ` (+${derived.gearStr})` : ''}`;
  document.getElementById('stat-dex-val').innerText = `${player.dex || 10}${derived.gearDex ? ` (+${derived.gearDex})` : ''}`;
  document.getElementById('stat-vit-val').innerText = `${player.vit || 10}${derived.gearVit ? ` (+${derived.gearVit})` : ''}`;
  document.getElementById('stat-int-val').innerText = `${player.int || 10}${derived.gearInt ? ` (+${derived.gearInt})` : ''}`;

  document.getElementById('summary-atk').innerText = derived.totalAtk;
  document.getElementById('summary-def').innerText = derived.totalDef;
  document.getElementById('summary-crit').innerText = `${derived.critChance}%`;
  document.getElementById('summary-spell').innerText = `+${derived.spellPowerPct}%`;
  document.getElementById('summary-hp').innerText = derived.calcMaxHp;
  document.getElementById('summary-mp').innerText = derived.calcMaxMp;

  const listEl = document.getElementById('skill-book-list');
  if (!listEl) return;
  listEl.innerHTML = '';

  SKILL_IDS.forEach(skillId => {
    const meta = ACTION_CATALOG[skillId];
    const rank = (player.skills && player.skills[skillId]) || 1;
    const rankMult = 1 + (rank - 1) * 0.2;
    const estDmg = Math.round(derived.totalAtk * meta.baseMult * rankMult);
    const currentSlotIdx = (player.actionBar || []).indexOf(skillId);
    const currentKey = currentSlotIdx >= 0 ? (player.keybinds[currentSlotIdx] || String(currentSlotIdx + 1)) : 'Unbound';

    let slotOptions = `<option value="-1">-- Bind to Slot --</option>`;
    for (let s = 0; s < 10; s++) {
      const k = (player.keybinds && player.keybinds[s]) || String(s + 1);
      slotOptions += `<option value="${s}" ${currentSlotIdx === s ? 'selected' : ''}>Slot ${s + 1} [Key: ${k}]</option>`;
    }

    const isListening = listeningForSlotKeybind !== null && listeningForSlotKeybind === currentSlotIdx && currentSlotIdx >= 0;

    const row = document.createElement('div');
    row.className = 'flex items-center justify-between gap-3 bg-slate-900/95 p-2.5 rounded-xl border border-slate-800 hover:border-amber-600/50 transition';
    row.innerHTML = `
      <div class="flex items-center gap-3">
        <div draggable="true"
             ondragstart="onDragStartAction(event, '${skillId}', null)"
             title="Drag onto any bottom Action Bar slot!"
             class="wow-slot flex items-center justify-center shrink-0"
             style="border-color:${meta.borderColor}">
          <img src="${meta.icon}" class="w-full h-full object-cover rounded pointer-events-none" />
          <span class="absolute bottom-0.5 right-1 text-[8px] font-black text-amber-300">R${rank}</span>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-extrabold text-xs" style="color:${meta.borderColor}">${meta.name}</span>
            <span class="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-amber-300 font-bold">Rank ${rank}/10</span>
            <span class="text-[10px] text-cyan-300 font-semibold">${meta.mpCost} MP</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-0.5">${meta.desc}</p>
          <div class="text-[10px] text-emerald-300 font-semibold mt-0.5">Current Output: ~${estDmg} DMG • Active Key: [${currentKey}]</div>
        </div>
      </div>

      <div class="flex flex-col items-end gap-1.5 shrink-0">
        <button onclick="upgradeSkillRank('${skillId}')"
                class="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-[10px] whitespace-nowrap">
          + Rank (1 Pt)
        </button>
        <div class="flex items-center gap-1">
          <select onchange="assignSkillToSlot('${skillId}', this.value)"
                  class="bg-slate-950 border border-amber-700/60 rounded px-1.5 py-0.5 text-[10px] text-amber-200">
            ${slotOptions}
          </select>
          ${currentSlotIdx >= 0 ? `
            <button onclick="startKeybindCapture(${currentSlotIdx})"
                    class="px-2 py-0.5 rounded border text-[9px] font-bold ${isListening ? 'bg-amber-500 text-black border-white animate-pulse' : 'bg-slate-800 text-slate-200 border-slate-600 hover:border-amber-400'}">
              ${isListening ? 'Press Key...' : 'Set Key'}
            </button>
          ` : ''}
        </div>
      </div>
    `;
    listEl.appendChild(row);
  });
}
