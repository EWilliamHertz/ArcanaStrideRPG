'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_CLASSES = [
  {
    id: 'knight',
    name: 'Chrono Blade',
    role: 'Temporal Melee Striker',
    icon: '⚔️',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.4)',
    desc: 'Master of temporal velocity and rapid steel. Dashes through void rifts and slices multiple foes in split seconds.',
    skills: ['Phantom Dash', 'Crimson Fury', 'Whirlwind', 'Sword Slash'],
    stats: { atk: '95%', spd: '98%', def: '72%', mag: '40%' }
  },
  {
    id: 'mage',
    name: 'Void Weaver',
    role: 'Arcane Ranged Sorcerer',
    icon: '🔮',
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.4)',
    desc: 'Harnesses raw celestial energy to unleash devastating homing Aether Bolts, arcane nova bursts, and ethereal crowd control.',
    skills: ['Aether Bolt', 'Holy Nova', 'Cosmic Shield', 'Mana Ether'],
    stats: { atk: '92%', spd: '65%', def: '48%', mag: '100%' }
  },
  {
    id: 'vanguard',
    name: 'Aegis Vanguard',
    role: 'Divine Sentinel & Colossus',
    icon: '🛡️',
    color: '#facc15',
    glow: 'rgba(250, 204, 21, 0.4)',
    desc: 'Unshakable juggernaut wielding sunforged plate. Crushes enemy ranks with Aegis Slam and sustains allies through holy aura wards.',
    skills: ['Aegis Slam', 'Holy Nova', 'Bulwark Shield', 'Blood Fury'],
    stats: { atk: '78%', spd: '55%', def: '100%', mag: '62%' }
  }
];

const FEATURES = [
  {
    tag: 'Combat Engine',
    title: 'Full 3D Action Combat',
    desc: 'Responsive directional WASD controls, real-time dodge dashing, 7 customizable skill slots, dynamic camera steering, and particle sword waves.',
    icon: '⚡',
    badge: 'Non-Target 60 FPS'
  },
  {
    tag: 'Path of Exile Endgame',
    title: 'Atlas Map Device & Orbs',
    desc: 'Reforge dungeons with Transmutation, Chaos, and Vaal Orbs. Roll lethal modifiers like Twinned Pinnacle Bosses, Teeming Hordes, and up to +200% loot quantity.',
    icon: '🌌',
    badge: 'Atlas Mapping'
  },
  {
    tag: 'World of Warcraft Style',
    title: '6 Instanced Dungeons & Raids',
    desc: 'From the Sunken Catacombs to the Heart of the Atlas, conquer multi-tiered zones featuring pack density scaling, elite creeps, and unique bosses.',
    icon: '🏰',
    badge: 'Dungeon Finder [M]'
  },
  {
    tag: 'Diablo II Heritage',
    title: 'Health Globes & Wargear',
    desc: 'Iconic dual Health and Mana globes, 5 tiers of gear rarity (Common to Legendary), randomized affix stats, and an interactive 16-slot inventory.',
    icon: '💎',
    badge: 'ARPG Itemization'
  },
  {
    tag: 'Hero Progression',
    title: 'Attributes & Skill Grimoire',
    desc: 'Allocate Attribute Points into Strength, Dexterity, Vitality, and Intelligence on level-up. Drag and customize actions on your bottom WoW action bar.',
    icon: '📜',
    badge: 'Talents & Stats [O]'
  },
  {
    tag: 'International Architecture',
    title: 'Zero-Install Global Realm',
    desc: 'Engineered for seamless low-latency browser play worldwide. WebSocket synchronized state, cloud auto-saves, and cross-platform accessibility.',
    icon: '🌐',
    badge: 'Global Netcode'
  }
];

const SERVERS = [
  { region: 'US East (Virginia)', ping: '24ms', status: 'Optimal' },
  { region: 'EU Central (Frankfurt)', ping: '38ms', status: 'Optimal' },
  { region: 'Asia East (Tokyo)', ping: '62ms', status: 'Optimal' },
  { region: 'South America (São Paulo)', ping: '74ms', status: 'Optimal' },
  { region: 'Oceania (Sydney)', ping: '82ms', status: 'Optimal' }
];

export default function LandingPage() {
  const [selectedClass, setSelectedClass] = useState(HERO_CLASSES[0]);

  const handleEnterRealm = () => {
    window.location.href = '/realm';
  };

  return (
    <div className="relative min-h-screen bg-[#070a14] text-slate-100 overflow-hidden bg-grid-pattern">
      {/* Dynamic Background Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/20 via-purple-600/15 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-2/3 -right-48 w-96 h-96 bg-rose-500/10 blur-[130px] pointer-events-none" />

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0e1e]/80 border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center text-xl font-black text-amber-300">
                Ω
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                ARCANASTRIDE 3D
              </span>
              <span className="block text-[10px] text-cyan-400 font-mono tracking-widest leading-none">
                INTERNATIONAL MMORPG
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-amber-300 transition">Features</a>
            <a href="#classes" className="hover:text-amber-300 transition">Classes</a>
            <a href="#atlas" className="hover:text-amber-300 transition">Atlas Device</a>
            <a href="#servers" className="hover:text-amber-300 transition">Servers</a>
          </nav>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnterRealm}
            className="relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 border border-yellow-300/60 transition flex items-center gap-2 group cursor-pointer"
          >
            <span>Enter Realm</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </motion.button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 flex flex-col items-center text-center">
        {/* Season Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Global Realm Online • Zero Install Required</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-5xl mb-6"
        >
          Experience the Depth of an{' '}
          <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(250,204,21,0.4)]">
            ARPG & MMORPG
          </span>{' '}
          in Real-Time 3D
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-xl text-slate-300 max-w-3xl mb-10 leading-relaxed font-normal"
        >
          Step into Arcanastride: an open-world chronicles realm fusing{' '}
          <span className="text-amber-300 font-bold">World of Warcraft</span> instanced dungeons,{' '}
          <span className="text-purple-300 font-bold">Path of Exile</span> Atlas map crafting, and{' '}
          <span className="text-rose-400 font-bold">Diablo</span> wargear itemization directly in any modern browser.
        </motion.p>

        {/* Main CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14"
        >
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: '0 0 35px rgba(250, 204, 21, 0.6)' }}
            whileTap={{ scale: 0.96 }}
            onClick={handleEnterRealm}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-base uppercase tracking-wider shadow-2xl border-2 border-yellow-200 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span className="text-xl">⚔️</span>
            <span>ENTER REALM (PLAY NOW)</span>
          </motion.button>

          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 hover:border-amber-500/60 transition flex items-center justify-center gap-2"
          >
            <span>Explore Systems</span>
            <span>↓</span>
          </a>
        </motion.div>

        {/* Quick Keyboard HUD Reference */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-400 max-w-4xl"
        >
          <span className="text-amber-400 font-bold">CONTROLS:</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">WASD</kbd> Move</span>
          <span>•</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Space</kbd> Sword Slash</span>
          <span>•</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">1-9</kbd> Action Bar</span>
          <span>•</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">M</kbd> Dungeons & Maps</span>
          <span>•</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">O</kbd> Stats & Skills</span>
          <span>•</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">I</kbd> Bag & Gear</span>
        </motion.div>
      </section>

      {/* FEATURE SHOWCASE GRID */}
      <section id="features" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold text-amber-400 uppercase tracking-widest mb-3">
            Game Systems & Mechanics
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Hardcore ARPG & MMO Enthusiasts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="rpg-card p-6 rounded-2xl flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-amber-600/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-950 border border-slate-700 text-amber-300">
                    {feat.badge}
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  {feat.tag}
                </span>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HERO CLASSES SHOWCASE */}
      <section id="classes" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-extrabold text-amber-400 uppercase tracking-widest mb-3">
            Hero Archetypes & Rig Customization
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Choose Your Combat Rig & Fighting Style
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-3 mb-10">
          {HERO_CLASSES.map((cls) => {
            const isSelected = selectedClass.id === cls.id;
            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-yellow-300 shadow-lg shadow-amber-500/30'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                <span>{cls.icon}</span>
                <span>{cls.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Class Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedClass.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="rpg-card p-8 rounded-3xl max-w-4xl mx-auto border-2"
            style={{ borderColor: selectedClass.color }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{selectedClass.icon}</span>
                  <div>
                    <h3 className="text-2xl font-black text-white">{selectedClass.name}</h3>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{selectedClass.role}</span>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {selectedClass.desc}
                </p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Signature Abilities</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedClass.skills.map(s => (
                    <span key={s} className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs font-semibold text-cyan-300">
                      ⚡ {s}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleEnterRealm}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/70 text-amber-300 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Play as {selectedClass.name}</span>
                  <span>→</span>
                </button>
              </div>

              {/* Combat Rating Bars */}
              <div className="md:col-span-5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Archetype Ratings</span>
                {Object.entries(selectedClass.stats).map(([stat, val]) => (
                  <div key={stat}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="uppercase text-slate-400">{stat}</span>
                      <span className="text-amber-300">{val}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-gradient-to-r from-amber-600 to-yellow-400 h-full rounded-full" style={{ width: val }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ENDGAME ATLAS DEVICE SPOTLIGHT */}
      <section id="atlas" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
        <div className="rpg-card p-8 sm:p-12 rounded-3xl border border-purple-500/40 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400 block mb-2">Endgame System</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Path of Exile Style Atlas Mapping
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Defeating dungeon monsters and elite bosses drops <b className="text-yellow-300">Chaos Orbs</b> and rare equipment. Use the in-game Atlas Map Device <kbd className="px-1 py-0.5 rounded bg-slate-950 border border-slate-700 text-xs font-mono text-purple-300">[M]</kbd> to craft custom map tiers:
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs mb-6">
                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-700">
                  <span className="font-bold text-white block mb-0.5">Normal (White)</span>
                  <span className="text-slate-400 text-[11px]">Standard area difficulty and base reward rates.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/90 border border-cyan-500/50">
                  <span className="font-bold text-cyan-300 block mb-0.5">Magic (Blue)</span>
                  <span className="text-slate-400 text-[11px]">1–2 affixes, +25% monster density & loot.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/90 border border-yellow-500/50">
                  <span className="font-bold text-amber-300 block mb-0.5">Rare (Yellow)</span>
                  <span className="text-slate-400 text-[11px]">3–4 lethal modifiers, high monster life & massive gold drops.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/90 border border-rose-500/50">
                  <span className="font-bold text-rose-400 block mb-0.5">Vaal Corrupted (Red)</span>
                  <span className="text-slate-400 text-[11px]">5 affixes + Twinned Pinnacle Bosses + +120% loot bonus.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-950/90 p-6 rounded-2xl border border-purple-500/30 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-950 border-2 border-purple-400 mx-auto flex items-center justify-center text-3xl mb-4 shadow-xl">
                🌌
              </div>
              <h3 className="text-lg font-black text-amber-300 mb-1">Atlas Map Device [M]</h3>
              <p className="text-xs text-slate-400 mb-4">
                Open in-game at any time with hotkey [M] to craft, roll, and enter 6 instanced dungeons.
              </p>
              <button
                onClick={handleEnterRealm}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg transition cursor-pointer"
              >
                Launch Game & Open Atlas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* REGIONAL SERVER STATUS */}
      <section id="servers" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest mb-2">
            Global Infrastructure
          </h2>
          <p className="text-3xl font-extrabold text-white tracking-tight">
            Low Latency Regional Routing
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
          {SERVERS.map(srv => (
            <div key={srv.region} className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mb-2 animate-pulse" />
              <div className="text-xs font-bold text-white mb-0.5">{srv.region}</div>
              <div className="text-[11px] font-mono text-emerald-400 font-bold">{srv.ping}</div>
              <span className="text-[10px] text-slate-500 block uppercase">{srv.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL BOTTOM CALL TO ACTION */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="rpg-card p-10 sm:p-14 rounded-3xl border-2 border-amber-500/60 shadow-2xl relative">
          <div className="inline-block text-4xl mb-4">👑</div>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            Your Journey into the Atlas Begins Now
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            No installation, no downloads. Jump straight into the 3D MMORPG right in your browser.
          </p>
          <motion.button
            whileHover={{ scale: 1.07, boxShadow: '0 0 45px rgba(250, 204, 21, 0.7)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnterRealm}
            className="px-12 py-5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-lg uppercase tracking-wider shadow-2xl border-2 border-yellow-200 cursor-pointer"
          >
            ENTER REALM NOW
          </motion.button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-[#050810] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Arcanastride 3D: Open World Chronicles • v1.0.0
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/EWilliamHertz/ArcanaStrideRPG" target="_blank" rel="noreferrer" className="hover:text-amber-300 transition">GitHub Repository</a>
            <span>•</span>
            <button onClick={handleEnterRealm} className="hover:text-amber-300 transition cursor-pointer">Launch Game</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
