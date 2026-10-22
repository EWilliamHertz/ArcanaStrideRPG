const fs = require('fs');
const path = require('path');
const { DEFAULT_PLAYER } = require('./defaultPlayer');

const SAVE_FILE = path.join(__dirname, '..', 'savegame.json');

function cloneDefaultPlayer() {
  return JSON.parse(JSON.stringify(DEFAULT_PLAYER));
}

function loadSave() {
  if (fs.existsSync(SAVE_FILE)) {
    try {
      const saved = JSON.parse(fs.readFileSync(SAVE_FILE, 'utf8'));
      const defaults = cloneDefaultPlayer();
      const merged = {
        ...defaults,
        ...saved,
        skills: { ...defaults.skills, ...(saved.skills || {}) },
        equipment: { ...defaults.equipment, ...(saved.equipment || {}) }
      };

      if (!Array.isArray(merged.actionBar) || merged.actionBar.length < 10) {
        merged.actionBar = [...defaults.actionBar];
      }
      if (!Array.isArray(merged.keybinds) || merged.keybinds.length < 10) {
        merged.keybinds = [...defaults.keybinds];
      }
      if (!Array.isArray(merged.inventory)) {
        merged.inventory = [...defaults.inventory];
      }
      // Retroactively award Attribute & Skill points to existing leveled characters
      if (saved.statPoints === undefined) {
        merged.statPoints = Math.max(5, (merged.level || 1) * 5);
      }
      if (saved.skillPoints === undefined) {
        merged.skillPoints = Math.max(2, (merged.level || 1) * 1);
      }
      if (saved.elixirs === undefined) {
        merged.elixirs = 2;
      }
      if (saved.chaosOrbs === undefined) {
        merged.chaosOrbs = 3;
      }
      return merged;
    } catch (e) {
      return cloneDefaultPlayer();
    }
  }
  return cloneDefaultPlayer();
}

function writeSave(data) {
  fs.writeFileSync(SAVE_FILE, JSON.stringify(data, null, 2));
}

function resetSave() {
  const fresh = cloneDefaultPlayer();
  writeSave(fresh);
  return fresh;
}

module.exports = {
  SAVE_FILE,
  loadSave,
  writeSave,
  resetSave
};
