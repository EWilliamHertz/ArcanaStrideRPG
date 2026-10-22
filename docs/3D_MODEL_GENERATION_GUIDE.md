# ArcanaStride 3D: 3D Model Generation Guide (Rodin AI & Tripo Studio)

This guide provides tested prompt formulas, workflows, and specifications to generate game-ready `.glb` 3D models for **ArcanaStride 3D** using free web-based AI 3D generators: **Tripo3D** and **Hyper3D Rodin**.

---

## 1. Free Web-Based Service Comparison

| Platform | Web Access | Free Tier Features | Best Suited For | Format Export |
| :--- | :--- | :--- | :--- | :--- |
| **Tripo3D Studio** | [`https://www.tripo3d.ai`](https://www.tripo3d.ai) | • Free trial credits upon signup (Google/Email)<br>• Daily free generation credits<br>• Built-in Auto-Rigging & Animations (Idle, Run, Attack)<br>• Retopology slider (Game Low-Poly to High-Poly) | **Player Characters, Humanoid Heroes, Animated Creeps** | `.glb`, `.fbx`, `.obj` |
| **Hyper3D Rodin** | [`https://hyper3d.ai`](https://hyper3d.ai) | • Free daily generation points<br>• High-fidelity PBR texture baking (Diffuse, Normal, Roughness)<br>• Sharp hard-surface edges & stylized silhouettes | **Boss Monsters, Heavy Armor, Weapons, Altars & Atlas Devices** | `.glb`, `.usd`, `.obj` |

---

## 2. Technical Requirements for ArcanaStride 3D Engine

To ensure seamless integration with Three.js (`GLTFLoader`), keep the following in mind:

1. **File Format**: Standard Binary GLTF (`.glb`).
2. **Polycount Target**:
   - Heroes / Bosses: 10,000 – 35,000 triangles.
   - Creeps / Minions: 3,000 – 12,000 triangles.
   - Environment Props (Chests, Altars): 1,500 – 8,000 triangles.
3. **Posing**:
   - For characters and monsters you want to animate: **Always request "A-Pose" or "T-Pose"**, feet flat on ground, arms angled 45°, symmetrical.
4. **Materials & Textures**: Embedded PBR texture (BaseColor, Metallic, Roughness). Keep texture sizes at 1024x1024 or 2048x2048 for optimal browser load speed.
5. **Drop-in Location**: Place exported `.glb` files into `/assets/<name>.glb`.

---

## 3. Ready-to-Use Prompts

### Category A: Playable Hero Archetypes

#### 1. Chrono Blade (Temporal Knight)
> **Goal**: Upgrade or replace `kaykit_knight.glb` / `soldier.glb` with a futuristic cyber-fantasy paladin.
- **Prompt (Tripo3D / Rodin)**:
  ```text
  Full-body 3D game character model of a Chrono Blade warrior, stylized low-poly ARPG hero, sleek obsidian and brushed titanium plate armor with glowing cyan energy seams, angular full-face visor helmet, leather waist coat with gold filigree trim, standing in symmetrical A-pose, arms relaxed at 45 degrees, feet flat on ground, clean topology, watertight manifold mesh, hand-painted PBR textures, video game asset, isolated on plain white background.
  ```
- **Negative Prompt**:
  ```text
  asymmetrical, deformed hands, missing fingers, extra limbs, blur, noisy background, weapon attached to hands, high-poly noise, photorealistic skin pores.
  ```

#### 2. Arcane Elementalist / Void Weaver (Mage Archetype)
> **Goal**: Upgrade or replace `kaykit_mage.glb` with a mystical astral sorcerer.
- **Prompt (Tripo3D / Rodin)**:
  ```text
  Full-body 3D stylized game character of a Void Sorcerer, tall mystical mage wearing layered dark indigo and violet astral robes with gold embroidered celestial runes, deep cowl hood with glowing ethereal purple eyes in darkness, floating runic shoulder pauldrons, leather wraps around bracers and boots, symmetrical T-pose, arms outstretched horizontally, clean game-ready topology, vibrant stylized PBR textures, isolated on white background.
  ```
- **Negative Prompt**:
  ```text
  crooked posture, extra arms, holding staff, blurred textures, realistic face, background elements.
  ```

#### 3. Shadow Stalker (Rogue / Assassin Archetype)
> **Goal**: Add a swift dual-blade skirmisher character.
- **Prompt (Tripo3D / Rodin)**:
  ```text
  Full-body 3D video game character of a shadow assassin rogue, stealth mercenary in form-fitting dark slate combat leather, reinforced segmented armor plating on shoulders and knees, cybernetic tactical half-mask visor with glowing green optical lenses, twin sheathed scabbards at lower back, hooded cowl, neutral symmetrical A-pose, arms 45 degrees, game asset, clean quads topology, stylized hand-painted texture, isolated on pure white background.
  ```

#### 4. Aegis Vanguard (Void Templar / Paladin)
> **Goal**: High-defense juggernaut hero.
- **Prompt (Tripo3D / Rodin)**:
  ```text
  Full-body 3D game model of an armored grand templar crusader, massive ornate golden-bronze plate armor with engraved radiant sun emblems, heavy lion-crest shoulder pauldrons, visored knight greathelm with glowing amber slit, thick leather belt with holy reliquary pouches, heroic broad physique, symmetrical A-pose, arms angled at 45 degrees, game-ready low-poly asset, stylized PBR materials, isolated on white background.
  ```

---

### Category B: Monster & Boss Creeps

#### 5. Void Corruptor / Arch-Lich (Ranged Mage Creep / Mini-Boss)
> **Goal**: Replace or augment `skeleton_mage.glb`.
- **Prompt (Tripo3D / Rodin)**:
  ```text
  Full-body stylized 3D monster model of an ancient undead arch-lich necromancer, levitating skeletal figure draped in tattered necrotic black and crimson ceremonial vestments, glowing magenta runes carved into floating obsidian ribs, crown of jagged void crystals, glowing purple flame eyes in bleached skull, arms raised in symmetrical spellcasting pose, clean stylized 3D game asset, game-ready topology, isolated on white background.
  ```

#### 6. Automaton Colossus (Mechanical Construct Golem)
> **Goal**: High-tier construct creep to replace `robot.glb`.
- **Prompt (Tripo3D / Rodin)**:
  ```text
  Full-body stylized 3D game enemy model of an ancient dwarven steam automaton golem, heavy reinforced brass and weathered steel mechanical body, exposed rotating clockwork gears in chest cavity with glowing turquoise furnace core, massive piston-driven fist gauntlets, glowing circular optic eye, symmetrical front-facing neutral pose, clean edge loops for game rigging, stylized PBR texture, isolated on neutral white background.
  ```

#### 7. Dread Broodmother (Arachnid Boss)
> **Goal**: Replace or augment `spider.glb`.
- **Prompt (Tripo3D / Rodin)**:
  ```text
  Full-body 3D monster model of a demonic armored cavern spider, spiky iridescent dark emerald and obsidian chitin carapace, glowing cluster of 8 crimson arachnid eyes, sharp curved fangs dripping with bio-luminescent toxic green venom, eight jointed armored legs spread evenly in symmetrical stable stance, clean manifold game topology, stylized mobile ARPG monster, isolated on pure white background.
  ```

#### 8. Void Swarmer Wasp (Flying Ranged Creep)
> **Goal**: Replace or augment `wasp.glb`.
- **Prompt (Tripo3D / Rodin)**:
  ```text
  Full-body 3D creature model of a corrupted abyssal hornet, segmented black and toxic amber striped chitin abdomen, sharp barbed curved stinger at rear, four semi-transparent crystalline electric-blue wings extended horizontally, glowing yellow compound eyes and sharp insectoid mandibles, symmetrical flying neutral pose, clean game-ready 3D asset, stylized textures, isolated on white background.
  ```

---

### Category C: World Props & Dungeon Devices

#### 9. Path of Exile-Style Atlas Map Device
> **Goal**: Environment centerpiece for the Outpost Nexus / Dungeon Portal.
- **Prompt (Rodin / Tripo3D)**:
  ```text
  3D game environment prop of an ancient circular celestial map device pedestal, weathered dark granite stone platform carved with glowing golden constellation glyphs, 6 floating orbital bronze mechanical rings revolving around a central glowing cosmic void portal vortex, inlaid brass gears and runic crystal sockets, top-down isometric RPG prop, clean game-ready low poly asset, PBR stylized texture, isolated on white background.
  ```

#### 10. Runed Archon Treasure Chest
> **Goal**: Upgrade or replace `chest.glb`.
- **Prompt (Rodin / Tripo3D)**:
  ```text
  3D game asset of a fantasy treasure chest, reinforced dark oak wood frame with ornate forged iron bindings and glowing golden runic engravings, heavy padlock shaped like an arcane eye, domed hinged lid slightly ajar with golden divine light rays leaking out, stylized Blizzard/Diablo hand-painted art style, clean low poly game mesh, PBR textures, isolated on white background.
  ```

---

## 4. Step-by-Step Generation & Ingestion Workflow

1. **Generate**:
   - Go to [`tripo3d.ai`](https://www.tripo3d.ai) or [`hyper3d.ai`](https://hyper3d.ai).
   - Paste the selected prompt into the **Text to 3D** prompt box.
   - Click **Generate**.
2. **Auto-Rig & Optimize (in Tripo3D)**:
   - Click the **Rigging** tab -> Choose **Humanoid Auto-Rig**.
   - Test the preview animation (e.g., *Walk* or *Attack*).
   - Under Export settings, choose **Format: GLB**, **Topology: Quad/Tri (Optimized 15k - 25k tris)**.
3. **Import into ArcanaStride 3D**:
   - Download the file as `new_character.glb` (or matching name, e.g. `paladin.glb`).
   - Move or copy it to the project's `/assets/` directory:
     ```bash
     mv ~/Downloads/new_character.glb /home/ewilliamhe/arcanastride-rpg/assets/paladin.glb
     ```
   - Register the model in [`public/js/config.js`](file:///home/ewilliamhe/arcanastride-rpg/public/js/config.js) under `GLB_URLS`:
     ```javascript
     GLB_URLS.paladin = '/assets/paladin.glb';
     ```
   - It will automatically be cached and loaded by Three.js into the world and class selector!
