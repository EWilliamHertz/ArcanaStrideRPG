// ============================================================
// ARCANASTRIDE 3D: WOW / DIABLO 2 COMPACT 10-SLOT ACTION BAR UI
// ============================================================

function getConsumableCount(actionId) {
  if (actionId === 'potion') return player.potions || 0;
  if (actionId === 'ether') return player.ethers || 0;
  if (actionId === 'elixir') return player.elixirs || 0;
  return null;
}

function renderActionBar() {
  const container = document.getElementById('wow-action-bar');
  if (!container) return;

  const bar = player.actionBar || [];
  const binds = player.keybinds || ['1', '2', '3', '4', '5', '6', 'Q', 'F', 'G', 'R'];

  container.innerHTML = '';

  for (let i = 0; i < 10; i++) {
    const actionId = bar[i] || 'slash';
    const meta = ACTION_CATALOG[actionId] || ACTION_CATALOG.slash;
    const keyLabel = (binds[i] || String(i + 1)).toUpperCase();
    const isConsumable = meta.type === 'consumable';
    const stackCount = getConsumableCount(actionId);
    const skillRank = (player.skills && player.skills[actionId]) || 1;

    const slot = document.createElement('div');
    slot.className = 'wow-slot flex items-center justify-center select-none';
    slot.style.borderColor = meta.borderColor || '#785a28';
    slot.dataset.slotIdx = i;
    slot.dataset.actionId = actionId;
    slot.draggable = true;

    // Click to fire skill or drink potion
    slot.onclick = () => triggerActionSlot(i);

    // Hover Tooltip
    slot.onmouseenter = () => showActionTooltip(actionId, i);
    slot.onmouseleave = () => hideActionTooltip();

    // Drag & Drop handlers (rearrange bar or drop from [O] Skill Book / [I] Inventory)
    slot.ondragstart = (ev) => onDragStartAction(ev, actionId, i);
    slot.ondragover = (ev) => {
      ev.preventDefault();
      slot.classList.add('drag-over');
    };
    slot.ondragleave = () => slot.classList.remove('drag-over');
    slot.ondrop = (ev) => {
      ev.preventDefault();
      slot.classList.remove('drag-over');
      onDropActionSlot(i);
    };

    // Bottom badge: MP cost for skills, stack count for potions/ethers/elixirs
    const bottomBadge = isConsumable
      ? `<span class="absolute bottom-0.5 right-1 text-[10px] font-black ${stackCount > 0 ? 'text-emerald-300' : 'text-rose-400'} drop-shadow">x${stackCount}</span>`
      : (meta.mpCost > 0
          ? `<span class="absolute bottom-0.5 right-1 text-[9px] font-bold text-cyan-300 drop-shadow">${meta.mpCost}m</span>`
          : `<span class="absolute bottom-0.5 right-1 text-[8px] font-bold text-slate-300 drop-shadow">0m</span>`);

    const rankBadge = !isConsumable
      ? `<span class="absolute top-0.5 right-1 text-[8px] font-extrabold text-amber-300 drop-shadow">R${skillRank}</span>`
      : '';

    slot.innerHTML = `
      <img src="${meta.icon}" class="w-full h-full object-cover rounded pointer-events-none" alt="${meta.name}" />
      <span class="absolute top-0.5 left-1 bg-black/85 px-1 rounded text-[9px] font-black text-amber-200 border border-amber-500/50 leading-tight pointer-events-none">${keyLabel}</span>
      ${rankBadge}
      ${bottomBadge}
      <div id="cd-overlay-${i}" class="absolute inset-0 bg-black/75 rounded pointer-events-none hidden flex items-center justify-center text-[10px] font-black text-amber-300"></div>
    `;

    container.appendChild(slot);
  }
}

function onDragStartAction(ev, actionId, fromSlotIdx = null) {
  draggedActionId = actionId;
  draggedFromSlot = fromSlotIdx;
  if (ev.dataTransfer) {
    ev.dataTransfer.setData('text/plain', actionId);
  }
}

function onDropActionSlot(targetSlotIdx) {
  if (!draggedActionId || !ACTION_CATALOG[draggedActionId]) return;

  if (!Array.isArray(player.actionBar)) {
    player.actionBar = [];
  }

  // If dragged from another slot on the bar, swap them!
  if (draggedFromSlot !== null && draggedFromSlot !== undefined && draggedFromSlot !== targetSlotIdx) {
    const prevTarget = player.actionBar[targetSlotIdx];
    player.actionBar[targetSlotIdx] = draggedActionId;
    player.actionBar[draggedFromSlot] = prevTarget;
  } else {
    player.actionBar[targetSlotIdx] = draggedActionId;
  }

  const meta = ACTION_CATALOG[draggedActionId];
  const keyName = (player.keybinds && player.keybinds[targetSlotIdx]) || String(targetSlotIdx + 1);
  addLog(`Assigned [${meta.name}] to Action Slot #${targetSlotIdx + 1} (Key [${keyName.toUpperCase()}])!`, "text-cyan-300 font-semibold");

  draggedActionId = null;
  draggedFromSlot = null;
  renderActionBar();
  if (!document.getElementById('stats-modal').classList.contains('hidden')) {
    renderStatsModal();
  }
  syncSave();
}

function showActionTooltip(actionId, slotIdx) {
  const tooltip = document.getElementById('action-tooltip');
  const meta = ACTION_CATALOG[actionId];
  if (!tooltip || !meta) return;

  const derived = getDerivedStats();
  const rank = (player.skills && player.skills[actionId]) || 1;
  const rankMult = 1 + (rank - 1) * 0.2;
  const estDmg = meta.baseMult ? Math.round(derived.totalAtk * meta.baseMult * rankMult) : null;
  const keyLabel = slotIdx !== undefined && player.keybinds ? player.keybinds[slotIdx] : '';

  tooltip.innerHTML = `
    <div class="flex justify-between items-center mb-1">
      <span class="font-extrabold text-sm" style="color:${meta.borderColor}">${meta.name} ${meta.type === 'skill' ? `(Rank ${rank})` : ''}</span>
      <span class="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-amber-600/40 text-amber-300 font-bold">Key [${keyLabel}]</span>
    </div>
    <div class="text-[10px] text-slate-400 mb-1">${meta.subtitle} • Cooldown: ${(meta.cooldownMs / 1000).toFixed(1)}s ${meta.mpCost ? `• Cost: ${meta.mpCost} MP` : ''}</div>
    <p class="text-[11px] text-slate-200 leading-snug">${meta.desc}</p>
    ${estDmg ? `<div class="mt-1 text-[10px] text-amber-300 font-bold">Estimated Power: ~${estDmg} DMG (Scales with STR/INT)</div>` : ''}
    <div class="mt-1 text-[9px] text-cyan-400">Tip: Drag slots to rearrange or open [O] to rebind keys</div>
  `;
  tooltip.classList.remove('hidden');
}

function hideActionTooltip() {
  const tooltip = document.getElementById('action-tooltip');
  if (tooltip) tooltip.classList.add('hidden');
}

function updateCooldownUI(now) {
  if (!player.actionBar) return;
  for (let i = 0; i < 10; i++) {
    const actionId = player.actionBar[i];
    const overlay = document.getElementById(`cd-overlay-${i}`);
    if (!overlay) continue;
    const cd = actionCooldowns[actionId];
    if (cd && now < cd.end) {
      const rem = ((cd.end - now) / 1000).toFixed(1);
      overlay.classList.remove('hidden');
      overlay.innerText = `${rem}s`;
    } else if (!overlay.classList.contains('hidden')) {
      overlay.classList.add('hidden');
    }
  }
}
