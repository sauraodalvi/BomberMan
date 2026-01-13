# Bomberman 2D (Phaser 3) — Reference Document

## 1) Project Goal
Build a fully responsive HTML5 Phaser 3 Bomberman-style game that:
- Shows **200px ad slots** on the left and right at all times
- Keeps the gameplay canvas **centered between ads**
- Runs smoothly on desktop and mobile
- Is built stage-by-stage from a clean foundation to a polished game, with optional multiplayer

---

## 2) Non-Negotiable Global Requirements (All Stages)
- **Grid**: `13 x 13` tile gameplay grid.
- **Ads**: `200px` fixed-width left + right, always visible.
- **Canvas layout**: centered between ads; never overlaps ads.
- **Responsiveness**: canvas scales with screen size while keeping aspect ratio.
- **Code pattern**: Phaser `Scene` with `preload()`, `create()`, `update()`.
- **Assets**: placeholders initially; later swapped to Kenney/OpenGameArt without changing logic.

---

## 3) Layout / DOM Requirements (Stable Through Entire Project)
We will use a 3-column layout:
- **Left column**: ad slot (200px)
- **Center column**: game wrapper (flex-grow, centered)
- **Right column**: ad slot (200px)

Center column contains:
- A subtle gradient background behind the canvas
- The Phaser canvas sized to fit available space (viewport minus ads)

Key layout rules:
- Game width never exceeds `viewportWidth - 400px`
- Game height fits within `viewportHeight` (or minus UI margin in Stage 6+)
- On resize/orientation change, game resizes without breaking alignment

---

## 4) Core Game World Rules (Used Everywhere)

### 4.1 Grid Math (Canonical)
Define constants:
- `GRID_SIZE = 13`
- `TILE_SIZE = <decide once>` (recommended: `48`)

Coordinate conversions:
- **Tile → world center**
  - `x = tileX * TILE_SIZE + TILE_SIZE/2`
  - `y = tileY * TILE_SIZE + TILE_SIZE/2`
- **World → tile**
  - `tileX = floor(x / TILE_SIZE)`
  - `tileY = floor(y / TILE_SIZE)`

### 4.2 Tile Types
Represent the map as a 2D array:
- `0 = floor`
- `1 = indestructible wall`
- `2 = destructible block`

### 4.3 Entity Types
- **Player**: world + tile position, speed, lives, maxBombs, blastRadius
- **Bomb**: tileX/tileY, fuse time, blastRadius, owner
- **Explosion**: computed affected tiles + visuals
- **Enemy**: sprite, speed, direction/state
- **Power-up**: type + tile position

---

## 5) Phaser Architecture (So We Don’t Rebuild Later)

### 5.1 Scenes
- **GameScene**: all gameplay systems (Stages 0–7)
- **UIScene (Stage 6+)**: score/lives/powerups overlay (screen-fixed UI)
- Optional: Boot/Preload scene if needed

### 5.2 Systems (Logical Modules Even If In One File)
- **Map system**: builds walls/blocks/floor
- **Collision system**: prevents passing through walls/blocks/bombs
- **Bomb system**: placement, fuse timing, explosion creation
- **Explosion system**: propagation, damage checks, block destruction
- **Enemy system**: spawn + AI movement
- **Power-up system**: spawn + collect + apply effects
- **FX system**: particles, glow, shake, shadows

---

## 6) Stage Plan (What We Will Implement)

## Stage 0 — Project Initialization
Deliverables:
- Responsive page with centered canvas + left/right ad slots
- 13x13 visible gameplay area (implicit or drawn)
- Player placeholder sprite at start tile
- Arrow-key movement (grid-bound)

## Stage 1 — Map & Tiles
Deliverables:
- Indestructible walls in classic pattern (every 2nd tile)
- Random destructible blocks (~50% on eligible tiles)
- Floor tiles
- Collisions: player blocked by walls and blocks
- Map perfectly centered between ads

## Stage 2 — Player Movement & Bomb Placement
Deliverables:
- Player sprite with smooth walking animations (4 frames per direction) or staged placeholder animations
- Smooth movement (continuous), WASD + arrows
- Space places bomb snapped to player’s current tile
- Bomb fuse animation 2–3 seconds
- Depth: subtle shadow under player

## Stage 3 — Bomb Explosions
Deliverables:
- Explosion cross propagation (up/down/left/right), uses blast radius
- Stops at walls; destroys destructible blocks
- Particles: fire/sparks/smoke + subtle glow
- Camera shake on explosion
- Player loses life if in blast

## Stage 4 — Enemies
Deliverables:
- 2–4 enemies spawn in safe corners (not overlapping player)
- Smooth movement AI, random direction, avoids walls/blocks
- Die when hit by explosion + death particles
- Player loses life on enemy collision
- Enemy shadows

## Stage 5 — Power-Ups
Deliverables:
- Power-ups spawn randomly when blocks are destroyed
- Types: Extra Bomb, Blast Radius Increase, Speed Boost
- Float + glow animation
- Collect on collision; apply effect immediately
- Shadows for power-ups

## Stage 6 — UI & Ad Slots
Deliverables:
- Score + Lives at top-left with animations
- Power-up indicators
- Ad slots display placeholder image/text; remain fixed
- Restart button resets game

## Stage 7 — Visual Polish
Deliverables:
- Camera follow (optional) + subtle zoom/shake
- Enhanced particles on explosions, deaths, pickups
- Lighting/shadows/glow improvements
- Idle animations, floating effects

## Stage 8 — Optional Multiplayer
Deliverables:
- Node.js + Socket.io backend
- 2 players, opposite corners
- Sync movement, bombs, explosions, powerups
- Collision handling and consistent game state

---

## 7) Acceptance Checklist (How We Verify Each Stage Works)
For every stage confirm:
- Ads are visible and not overlapped
- Canvas stays centered and responsive
- Existing features still work (no regressions)
- Controls behave correctly
- Collisions/damage rules are correct for that stage

---

## 8) Open Decisions (Needed Before We Start Coding Stage 0)
Please confirm these (they affect all later stages):
1) **Tile size**: `48` (default) / `40` / `32`
2) **Collision approach**: Phaser Arcade Physics (default) / manual tile collision
3) **Mobile ads**: keep always visible (default) / allow collapse below certain width
4) **Spawn rule**: player starts at `(1,1)` and we reserve nearby tiles as safe (default: yes)
