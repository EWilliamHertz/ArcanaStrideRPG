// ============================================================
// ARCANASTRIDE 3D: [I] INVENTORY, EQUIPMENT, LOOT & SHOP
// ============================================================

function generateLootDrop(tierBonus = 0) {
  const tmpl = LOOT_TEMPLATES[Math.floor(Math.random() * LOOT_TEMPLATES.length)];
  const floorTier = (player.floor || 1) + tierBonus;
  const rarityRoll = Math.min(
    RARITY_TIERS.length - 1,
    Math.floor(Math.random() * Math.min(RARITY_TIERS.length, 2 + Math.floor(floorTier / 2)))
  );
  const rarity = RARITY_TIERS[rarityRoll];
  const scale = rarity.mult * (1 + (floorTier - 1) * 0.18);

  const atk = tmpl.baseAtk > 0 ? Math.max(1, Math.round(tmpl.baseAtk * scale)) : 0;
  const def = tmpl.baseDef > 0 ? Math.max(1, Math.round(tmpl.baseDef * scale)) : 0;
  const str = Math.random() < 0.6 ? Math.max(1, Math.round(2 * scale)) : 0;
  const dex = Math.random() < 0.5 ? Math.max(1, Math.round(2 * scale)) : 0;
  const vit = Math.random() < 0.6 ? Math.max(1, Math.round(2 * scale)) : 0;
  const int = Math.random() < 0.5 ? Math.max(1, Math.round(2 * scale)) : 0;

  return {
    id: 'loot_' + Date.now() + '_' + Math.floor(Math.random() * 9999),
    name: `${rarity.name} ${tmpl.name}`,
    slot: tmpl.slot,
    rarity: rarity.name,
    color: rarity.color,
    icon: tmpl.icon,
    atk,
    def,
    str,
    dex,
    vit,
    int,
    value: Math.round((25 + atk * 4 + def * 4) * rarity.mult)
  };
}

function toggleInventoryModal() {
  const modal = document.getElementById('inventory-modal');
  if (!modal) return;
  const isHidden = modal.classList.contains('hidden');
  if (isHidden) {
    document.getElementById('stats-modal').classList.add('hidden');
    const dm = document.getElementById('dungeon-modal');
    if (dm) dm.classList.add('hidden');
    renderInventoryModal();
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
}

function formatItemStats(item) {
  if (!item) return 'Empty Slot';
  const parts = [];
  if (item.atk) parts.push(`+${item.atk} ATK`);
  if (item.def) parts.push(`+${item.def} DEF`);
  if (item.str) parts.push(`+${item.str} STR`);
  if (item.dex) parts.push(`+${item.dex} DEX`);
  if (item.vit) parts.push(`+${item.vit} VIT`);
  if (item.int) parts.push(`+${item.int} INT`);
  return parts.join(' • ') || 'Basic Wargear';
}

function equipBagItem(bagIndex) {
  if (!Array.isArray(player.inventory) || !player.inventory[bagIndex]) return;
  const item = player.inventory[bagIndex];
  const targetSlot = item.slot || 'weapon';
  if (!player.equipment) player.equipment = {};

  const prevEquipped = player.equipment[targetSlot];
  player.equipment[targetSlot] = item;

  if (prevEquipped) {
    player.inventory[bagIndex] = prevEquipped;
  } else {
    player.inventory.splice(bagIndex, 1);
  }

  addLog(`Equipped [${item.name}] (${formatItemStats(item)})!`, "text-amber-300 font-bold");
  updateHUD();
  renderInventoryModal();
  syncSave();
}

function sellBagItem(bagIndex, ev) {
  if (ev) ev.stopPropagation();
  if (!Array.isArray(player.inventory) || !player.inventory[bagIndex]) return;
  const item = player.inventory[bagIndex];
  const val = item.value || 35;
  player.gold += val;
  player.inventory.splice(bagIndex, 1);
  addLog(`Sold ${item.name} for +${val}g.`, "text-yellow-300");
  updateHUD();
  renderInventoryModal();
  syncSave();
}

function sellAllBagItems() {
  if (!Array.isArray(player.inventory) || player.inventory.length === 0) {
    addLog("Your backpack has no unequipped gear to sell.", "text-slate-400");
    return;
  }
  let totalGold = 0;
  const count = player.inventory.length;
  player.inventory.forEach(item => {
    totalGold += (item.value || 35);
  });
  player.inventory = [];
  player.gold += totalGold;
  addLog(`Sold ${count} backpack items for +${totalGold} Gold!`, "text-yellow-300 font-bold");
  updateHUD();
  renderInventoryModal();
  syncSave();
}

function renderInventoryModal() {
  const eqGrid = document.getElementById('equipped-gear-grid');
  const beltGrid = document.getElementById('consumables-belt-grid');
  const bagGrid = document.getElementById('backpack-grid');
  const bagCount = document.getElementById('bag-count');
  if (!eqGrid || !beltGrid || !bagGrid) return;

  const slots = [
    { key: 'weapon', label: 'Main Hand' },
    { key: 'helm', label: 'Headgear' },
    { key: 'armor', label: 'Chest Armor' },
    { key: 'relic', label: 'Arcane Relic' }
  ];

  eqGrid.innerHTML = '';
  slots.forEach(({ key, label }) => {
    const item = player.equipment && player.equipment[key];
    const card = document.createElement('div');
    card.className = 'bg-slate-950/90 p-2.5 rounded-xl border-2 flex items-center gap-2.5';
    card.style.borderColor = item ? item.color : '#334155';
    card.innerHTML = item ? `
      <img src="${getRpgIcon(item.icon)}" class="w-10 h-10 rounded-lg border border-amber-500/40 shrink-0" />
      <div class="min-w-0">
        <div class="text-[9px] uppercase text-slate-400 font-bold">${label}</div>
        <div class="text-xs font-extrabold truncate" style="color:${item.color}">${item.name}</div>
        <div class="text-[10px] text-emerald-300 font-semibold">${formatItemStats(item)}</div>
      </div>
    ` : `
      <div class="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 text-xs">--</div>
      <div>
        <div class="text-[9px] uppercase text-slate-500 font-bold">${label}</div>
        <div class="text-xs text-slate-500">Empty</div>
      </div>
    `;
    eqGrid.appendChild(card);
  });

  // Render Consumables Belt (Draggable to Action Bar!)
  beltGrid.innerHTML = '';
  ['potion', 'ether', 'elixir'].forEach(cid => {
    const meta = ACTION_CATALOG[cid];
    const count = getConsumableCount(cid);
    const card = document.createElement('div');
    card.className = 'bg-slate-900/95 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700 cursor-pointer flex items-center gap-2.5';
    card.draggable = true;
    card.ondragstart = (ev) => onDragStartAction(ev, cid, null);
    card.onclick = () => triggerActionById(cid);
    card.innerHTML = `
      <div class="wow-slot flex items-center justify-center shrink-0" style="border-color:${meta.borderColor}">
        <img src="${meta.icon}" class="w-full h-full object-cover rounded pointer-events-none" />
        <span class="absolute bottom-0.5 right-1 text-[10px] font-black text-emerald-300">x${count}</span>
      </div>
      <div>
        <div class="text-xs font-extrabold" style="color:${meta.borderColor}">${meta.name}</div>
        <div class="text-[10px] text-slate-400">${meta.desc}</div>
        <div class="text-[9px] text-amber-300 font-semibold mt-0.5">Click to Use • Drag to Action Bar</div>
      </div>
    `;
    beltGrid.appendChild(card);
  });

  // Render Backpack Grid
  const inv = player.inventory || [];
  bagCount.innerText = inv.length;
  bagGrid.innerHTML = '';

  if (inv.length === 0) {
    bagGrid.innerHTML = `<div class="col-span-4 text-center py-6 text-xs text-slate-500">Backpack is empty. Slay monsters or open Treasure Chests to loot Wargear!</div>`;
    return;
  }

  inv.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'bg-slate-900/90 hover:bg-slate-800 p-2.5 rounded-xl border transition cursor-pointer flex flex-col justify-between';
    card.style.borderColor = item.color || '#475569';
    card.onclick = () => equipBagItem(idx);
    card.innerHTML = `
      <div class="flex items-center gap-2 mb-1.5">
        <img src="${getRpgIcon(item.icon)}" class="w-9 h-9 rounded border border-amber-500/40 shrink-0" />
        <div class="min-w-0">
          <div class="text-[9px] uppercase text-slate-400 font-bold">${item.rarity} ${item.slot}</div>
          <div class="text-xs font-extrabold truncate" style="color:${item.color}">${item.name}</div>
        </div>
      </div>
      <div class="text-[10px] text-emerald-300 font-semibold mb-2">${formatItemStats(item)}</div>
      <div class="flex justify-between items-center pt-1 border-t border-slate-800 text-[10px]">
        <span class="text-cyan-300 font-bold">Click: Equip</span>
        <button onclick="sellBagItem(${idx}, event)" class="px-1.5 py-0.5 rounded bg-amber-950 hover:bg-amber-800 text-yellow-300 font-bold">Sell (${item.value || 35}g)</button>
      </div>
    `;
    bagGrid.appendChild(card);
  });
}

// Quartermaster Shop & World Interactions
function handleInteract() {
  const derived = getDerivedStats();
  if (playerGroup.position.distanceTo(sanctuaryPos) < 7) {
    if (player.gold >= 15) {
      player.gold -= 15;
      player.hp = derived.calcMaxHp;
      player.mp = derived.calcMaxMp;
      createBurst(playerGroup.position, 0x10b981, 25);
      addLog("Rested at the Sanctuary Shrine (-15g). Full HP & MP restored!", "text-emerald-300 font-bold");
      updateHUD();
      syncSave();
    } else {
      addLog("You need 15g to channel the Sanctuary Shrine!", "text-rose-400");
    }
  } else if (playerGroup.position.distanceTo(shopPos) < 7) {
    document.getElementById('shop-modal').classList.remove('hidden');
  } else if (playerGroup.position.distanceTo(bossGatePos) < 12) {
    if (typeof summonZoneBossNow === 'function') {
      summonZoneBossNow();
    } else if (!enemies.some(e => e.isBoss)) {
      spawnEnemy(true);
    }
  }
}

function toggleShopModal() {
  const modal = document.getElementById('shop-modal');
  if (!modal) return;
  if (modal.classList.contains('hidden')) {
    document.getElementById('stats-modal').classList.add('hidden');
    document.getElementById('inventory-modal').classList.add('hidden');
    const dm = document.getElementById('dungeon-modal');
    if (dm) dm.classList.add('hidden');
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
}

function closeShop() {
  document.getElementById('shop-modal').classList.add('hidden');
}

function buyItem(type) {
  if (type === 'potion' && player.gold >= 25) {
    player.gold -= 25;
    player.potions += 1;
    addLog("Purchased Crimson Health Potion!", "text-emerald-400");
  } else if (type === 'ether' && player.gold >= 30) {
    player.gold -= 30;
    player.ethers += 1;
    addLog("Purchased Azure Mana Ether!", "text-blue-400");
  } else if (type === 'elixir' && player.gold >= 60) {
    player.gold -= 60;
    player.elixirs = (player.elixirs || 0) + 1;
    addLog("Purchased Elixir of Blood Fury!", "text-rose-400");
  } else if (type === 'chaos' && player.gold >= 90) {
    player.gold -= 90;
    player.chaosOrbs = (player.chaosOrbs || 0) + 1;
    addLog("Purchased Path of Exile Chaos Orb! Press [M] to roll Map Modifiers!", "text-amber-300 font-bold");
  } else if (type === 'mystery' && player.gold >= 120) {
    if ((player.inventory || []).length >= 16) {
      return addLog("Backpack is full! Open [I] to sell or equip gear first.", "text-rose-400");
    }
    player.gold -= 120;
    const gambled = generateLootDrop(2);
    player.inventory.push(gambled);
    addLog(`★ GAMBLED WARGEAR: Received [${gambled.rarity}] ${gambled.name}! Open [I] to inspect!`, "text-amber-300 font-bold");
  } else if (type === 'atk' && player.gold >= 75) {
    player.gold -= 75;
    player.atk += 3;
    addLog("Weapon honed! (+3 Base ATK)", "text-amber-300");
  } else if (type === 'def' && player.gold >= 75) {
    player.gold -= 75;
    player.def += 2;
    addLog("Armor tempered! (+2 Base DEF)", "text-cyan-300");
  } else {
    addLog("Not enough Gold!", "text-rose-400");
  }
  updateHUD();
  syncSave();
}
