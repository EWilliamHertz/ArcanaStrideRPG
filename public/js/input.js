// ============================================================
// ARCANASTRIDE 3D: KEYBOARD, HOTKEY & ORBITAL CAMERA INPUTS
// ============================================================

window.addEventListener('keydown', (e) => {
  // Ignore hotkeys if typing inside an input or select element
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) {
    return;
  }

  // Handle interactive keybind capture inside [O] Skill Grimoire
  if (listeningForSlotKeybind !== null) {
    e.preventDefault();
    if (e.key !== 'Escape') {
      const boundKey = e.code === 'Space' ? 'SPACE' : e.key.toUpperCase();
      if (['W', 'A', 'S', 'D', 'ARROWUP', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT'].includes(boundKey)) {
        addLog(`[${boundKey}] is reserved for walking & camera movement! Choose another key.`, "text-rose-400 font-bold");
        listeningForSlotKeybind = null;
        renderStatsModal();
        return;
      }
      if (!Array.isArray(player.keybinds)) {
        player.keybinds = ['1', '2', '3', '4', '5', '6', 'Q', 'F', 'G', 'R'];
      }
      player.keybinds[listeningForSlotKeybind] = boundKey;
      addLog(`Rebound Action Slot #${listeningForSlotKeybind + 1} to key [${boundKey}]!`, "text-amber-300 font-bold");
      renderActionBar();
      syncSave();
    }
    listeningForSlotKeybind = null;
    renderStatsModal();
    return;
  }

  const k = e.key.toLowerCase();

  // Clicking/pressing [S] or [ArrowDown] to walk backward turns the hero 180° AND smoothly rotates the camera behind you!
  if ((k === 's' || k === 'arrowdown') && !keys['s'] && !keys['arrowdown']) {
    sMovementYaw = cameraYaw;
    sTurnTargetYaw = cameraYaw + Math.PI;
  } else if (k === 'w' || k === 'arrowup') {
    sTurnTargetYaw = null;
    sMovementYaw = null;
  }

  keys[k] = true;

  // Never trigger hotkeys on WASD movement keys
  if (k === 'w' || k === 'a' || k === 's' || k === 'd' || k.startsWith('arrow')) {
    return;
  }

  if (e.key === 'Escape') {
    closeShop();
    closeClassModal();
    document.getElementById('stats-modal').classList.add('hidden');
    document.getElementById('inventory-modal').classList.add('hidden');
    document.getElementById('dungeon-modal').classList.add('hidden');
    return;
  }

  // Toggle [M] Dungeon Finder & Path of Exile Atlas Modal
  if (k === 'm') {
    e.preventDefault();
    toggleDungeonModal();
    return;
  }

  // Toggle [I] Inventory & Wargear Modal
  if (k === 'i' || k === 'b') {
    e.preventDefault();
    toggleInventoryModal();
    return;
  }

  // Toggle [O] Hero Attributes & Skill Grimoire Modal
  if (k === 'o' || k === 'k') {
    e.preventDefault();
    toggleStatsModal();
    return;
  }

  // Toggle [P] Nomadic Quartermaster Outpost Shop Modal
  if (k === 'p') {
    e.preventDefault();
    toggleShopModal();
    return;
  }

  // Toggle [C] Hero Class & 3D Rig Modal
  if (k === 'c') {
    e.preventDefault();
    const clsModal = document.getElementById('class-modal');
    if (clsModal.classList.contains('hidden')) openClassModal();
    else closeClassModal();
    return;
  }

  // World Interaction [E]
  if (k === 'e') {
    handleInteract();
    return;
  }

  // Quick Dash [Shift]
  if (e.key === 'Shift') {
    dashMove();
    return;
  }

  // Quick Basic Sword Slash [Space]
  if (e.code === 'Space') {
    e.preventDefault();
    const slashSlot = (player.actionBar || []).indexOf('slash');
    if (slashSlot >= 0) triggerActionSlot(slashSlot);
    else triggerActionById('slash');
    return;
  }

  // Match pressed key against customizable 10-slot WoW Action Bar keybinds
  const pressedKeyUpper = e.key.toUpperCase();
  const binds = player.keybinds || ['1', '2', '3', '4', '5', '6', 'Q', 'F', 'G', 'R'];
  const slotIdx = binds.findIndex(b => (b || '').toUpperCase() === pressedKeyUpper);
  if (slotIdx !== -1) {
    e.preventDefault();
    triggerActionSlot(slotIdx);
  }
});

window.addEventListener('keyup', (e) => {
  const k = e.key.toLowerCase();
  keys[k] = false;
  if (!keys['s'] && !keys['arrowdown']) {
    sMovementYaw = null;
  }
});

// Prevent browser selection highlight when clicking/dragging the 3D viewport or UI
window.addEventListener('selectstart', (e) => {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
  e.preventDefault();
});

window.addEventListener('mousedown', (e) => {
  if (e.target && e.target.tagName === 'CANVAS') {
    e.preventDefault();
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
    isPointerDown = true;
    sTurnTargetYaw = null;
  }
});

window.addEventListener('mouseup', () => {
  isPointerDown = false;
});

window.addEventListener('mousemove', (e) => {
  if (!isPointerDown) return;
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  }
  sTurnTargetYaw = null;
  cameraYaw -= e.movementX * 0.007;
  cameraPitch = Math.max(0.15, Math.min(1.15, cameraPitch + e.movementY * 0.006));
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
