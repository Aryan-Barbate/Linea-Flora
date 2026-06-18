# Manual Bouquet Builder — Implementation Plan

## Overview

Replace the automatic template-based bouquet arrangement system with a fully interactive drag-and-drop bouquet builder. Users become florists — picking flowers from a catalog and positioning them freely on a bouquet canvas with transform controls, layer ordering, and alignment guides.

**UX Goal:** The user should feel like they are arranging flowers on a florist workbench — Canva/Figma for bouquet creation while preserving DigiBouquet's vintage botanical aesthetic.

---

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Drag system | Native pointer events + refs | Zero new dependencies; Framer Motion already handles spring animations. `onPointerDown/Move/Up` gives unified mouse+touch. |
| State model | `useReducer` in BuilderScreen | Complex state (position, rotation, scale, z-index per flower) doesn't fit simple `useState`. Actions are predictable and testable. |
| Pinch-to-scale | Touch event pair tracking | Two-finger distance delta drives scale. No library needed for this single gesture. |
| Two-finger rotate | Touch event angle delta | `Math.atan2` between finger positions yields rotation delta. |
| Alignment detection | Nearest-center threshold scan | On drag, check horizontal/vertical distance to canvas center + other flowers. Show guides when < 6px. |
| URL sharing | Append positional params to existing format | `p` param encodes compact position data. Old links still work (random fallback). |

---

## New Step Flow

```
0: LandingScreen          (unchanged)
1: BuilderScreen          (NEW — replaces SelectScreen + CustomizeScreen)
2: CardScreen             (unchanged, was step 3)
3: MusicScreen            (unchanged, was step 4)
4: WrapScreen             (unchanged, was step 5)
5: RibbonScreen           (unchanged, was step 6)
6: PreviewScreen          (unchanged, was step 7)
7: GardenScreen           (unchanged, was step 8)
```

**Deleted files:**
- `src/screens/SelectScreen.jsx`
- `src/screens/CustomizeScreen.jsx`
- `src/utils/bouquetArranger.js`
- `src/utils/bouquetTemplates.js`

**Modified files:**
- `src/App.jsx` — update STEPS array
- `src/context/BouquetContext.jsx` — new `PlacedFlower` data model
- `src/components/BouquetPreview.jsx` — consume placed flowers instead of arrangement algorithm
- `src/utils/shareUrl.js` — encode/decode placement data
- `src/screens/PreviewScreen.jsx` — remove "Try Another Arrangement" button

---

## Data Model

### PlacedFlower type (stored as array in context)

```javascript
{
  id: string,          // unique instance ID (e.g., "rose-0", "rose-1")
  flowerId: string,    // flower type ("rose", "lily", etc.)
  x: number,           // pixels from canvas center (positive = right)
  y: number,           // pixels from canvas center (positive = down)
  rotation: number,    // degrees
  scale: number,       // multiplier (default 1.0)
  z: number,           // layer order (lower = behind, higher = in front)
  flipped: boolean,    // horizontal flip
}
```

### State changes in BouquetContext

**Remove:**
- `arrangementSeed` state
- `shuffleArrangement` callback
- `addFlower` / `removeFlower` callbacks (replaced by reducer actions)

**Add:**
- `placedFlowers` — `PlacedFlower[]` state
- `setPlacedFlowers` — setter for full array replacement
- Individual flower image size lookup already exists via `getBouquetImgSize()`

---

## File-by-File Changes

### 1. `src/context/BouquetContext.jsx`

- Add `PlacedFlower` constants: `DEFAULT_FLOWER_SCALE = 1.0`, `CANVAS_CENTER_X = 250`, `CANVAS_CENTER_Y = 210`
- Add `placedFlowers` state: `useState(initialState?.placedFlowers ?? [])`
- Add `setPlacedFlowers` callback
- Export `getFlowerZIndex(placedFlowers)` helper — returns next available z value
- Remove `arrangementSeed`, `shuffleArrangement`
- Update `useMemo` value object
- Keep all existing exports (FLOWERS, WRAPS, RIBBON_*, etc.) unchanged

### 2. `src/utils/builderReducer.js` (NEW)

```javascript
// Actions:
//   ADD_FLOWER { flowerId }
//   MOVE_FLOWER { id, x, y }
//   SET_POSITION { id, x, y, rotation, scale }
//   ROTATE_FLOWER { id, delta }
//   SCALE_FLOWER { id, delta }
//   FLIP_FLOWER { id }
//   DUPLICATE_FLOWER { id }
//   DELETE_FLOWER { id }
//   BRING_FORWARD { id }
//   SEND_BACKWARD { id }
//   SELECT_FLOWER { id }
//   DESELECT_ALL
```

**Default placement when adding:** x = random(-20, 20), y = random(-15, 15), rotation = random(-8, 8), scale = 1.0, z = next available

**Bounding constraints:** Clamp x to [-150, 150], y to [-120, 100] after move

### 3. `src/components/BuilderCanvas.jsx` (NEW — ~400 lines)

Main bouquet canvas component. Props: `placedFlowers, selectedId, onSelectFlower, onMoveFlower, onMoveComplete, mode, greenery, wrap, ribbon, scale, showGuides`.

**Structure:**
```
<div class="relative" style={500×410 scaled dimensions}>
  <!-- Safe area boundary (optional dashed border) -->
  <!-- Alignment guides (dashed lines) -->
  <!-- BackWrap -->
  <!-- Greenery bush -->
  <!-- Back flower layer (z < 10) -->
  <!-- Mid flower layer (z 10-25) -->
  <!-- Top greenery -->
  <!-- Front flower layer (z >= 25) -->
  <!-- FrontWrap -->
  <!-- RibbonLayer -->
</div>
```

**Drag handling (on each flower):**
- `onPointerDown` → capture pointer, set dragging state, call `onSelectFlower`
- `onPointerMove` → update position via `onMoveFlower(id, x, y)`, compute alignment guides
- `onPointerUp` → release pointer, call `onMoveComplete` (spring settle), clear dragging state

**Mobile gestures:**
- Single finger → drag
- Two fingers → pinch (scale) + rotate
- Track `touchstart`/`touchmove`/`touchend` on the canvas container

**Alignment guides:**
- Compute dragged flower center (x + CANVAS_CENTER_X, y + CANVAS_CENTER_Y)
- Check distance to canvas center (250, 210)
- Check distance to each other flower's center
- If within 6px threshold → show horizontal or vertical guide line
- Guide lines: dashed, `stroke="#000"`, `strokeDasharray="4 4"`, `opacity=0.3`

**Layer rendering:**
- Sort `placedFlowers` by z ascending
- Render in three groups based on z thresholds (< 10, 10-25, >= 25) for the existing back/mid/front visual layering
- Each flower rendered as `<img>` with `transform: translate(-50%, -50%) rotate(Rdeg) scaleX(F) scale(S)`
- Selected flower gets subtle ring/border indicator

### 4. `src/components/FlowerElement.jsx` (NEW — ~80 lines)

Individual draggable flower. Props: `item, isSelected, isDragging, onPointerDown, scale, mode`.

**Rendering:**
- `<motion.div>` with `initial={{ opacity: 0, scale: 0.8 }}` for entry animation
- Image from CDN: `${base}/flowers/${item.flowerId}.webp`
- Transform: `rotate(${item.rotation}deg) scaleX(${item.flipped ? -1 : 1}) scale(${item.scale})`
- When dragging: `scale: 1.05` via motion `whileTap`
- When not dragging: spring settle animation via `animate={{ x: 0, y: 0 }}`

**Selection indicator:**
- Dashed ring around selected flower (2px dashed black, 4px offset)

### 5. `src/components/TransformControls.jsx` (NEW — ~150 lines)

Floating toolbar for selected flower transforms. Props: `selectedFlower, onAction`.

**Desktop layout:** Vertical toolbar pinned to right edge of canvas
**Mobile layout:** Horizontal toolbar at bottom of canvas

**Buttons:**
| Icon | Action | Description |
|------|--------|-------------|
| ↶ | `ROTATE_FLOWER { delta: -15 }` | Rotate counterclockwise |
| ↷ | `ROTATE_FLOWER { delta: 15 }` | Rotate clockwise |
| ⊖ | `SCALE_FLOWER { delta: -0.1 }` | Scale down |
| ⊕ | `SCALE_FLOWER { delta: 0.1 }` | Scale up |
| ⇔ | `FLIP_FLOWER` | Flip horizontally |
| ⧉ | `DUPLICATE_FLOWER` | Duplicate |
| ␡ | `DELETE_FLOWER` | Delete |
| ⇧ | `BRING_FORWARD` | Bring forward one layer |
| ⇩ | `SEND_BACKWARD` | Send backward one layer |

**Styling:** Matches existing UI — monospace font, hard-edge buttons, black/beige palette. `font-mono text-xs uppercase tracking-widest`. Size: `px-2 py-1.5`.

### 6. `src/screens/BuilderScreen.jsx` (NEW — ~300 lines)

The main screen combining flower selection + canvas arrangement.

**Layout:**
```
┌─────────────────────────────────────┐
│           StepHeader                │
│                                     │
│  ┌───────────────────────────────┐  │
│  │     FLOWER CATALOG (top)      │  │
│  │  Grid of 12 flowers           │  │
│  │  Click to add to canvas       │  │
│  │  Already-placed shown dimmed  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │     BOUQUET CANVAS            │  │
│  │  Wrap + greenery + flowers    │  │
│  │  Drag to position             │  │
│  │  Alignment guides             │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   TRANSFORM CONTROLS (right)  │  │
│  │   Layer controls              │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │   SETTINGS BAR                │  │
│  │   Color/B&W | Greenery | etc  │  │
│  └───────────────────────────────┘  │
│                                     │
│  [BACK]                    [NEXT]   │
└─────────────────────────────────────┘
```

**State management:**
- Uses `useReducer` with `builderReducer`
- `placedFlowers` state + dispatch
- `selectedId` state (which flower is selected)
- Syncs `placedFlowers` to context on every change via `setPlacedFlowers`

**Flower catalog section:**
- Renders all 12 flowers from `FLOWERS` constant
- Already-placed flowers shown with reduced opacity + checkmark
- Click adds flower to canvas (dispatches `ADD_FLOWER`)
- Shows flower count badge: "3/10 placed"
- Min 6, max 10 flowers — NEXT button disabled below 6

**Canvas section:**
- `<BuilderCanvas>` with all placed flowers
- Background: cream (#F9F9EE)
- Safe area: subtle dashed border in flower arrangement zone

**Transform controls:**
- `<TransformControls>` positioned absolute right side of canvas
- Only visible when a flower is selected
- Each button dispatches to reducer

**Settings bar:**
- Color/B&W toggle button
- Greenery cycle button
- Same styling as current CustomizeScreen buttons

**Navigation:**
- BACK → `setStep(0)` (landing)
- NEXT → `setStep(2)` (card screen) — only enabled when `placedFlowers.length >= 6`

### 7. `src/components/BouquetPreview.jsx` (MODIFIED)

**Changes:**
- Remove `import { arrangeBouquet }` — no longer used
- Remove `import TEMPLATES` — no longer used
- New props: `placedFlowers` instead of `flowers` + `arrangementSeed`
- Replace `arrangeBouquet()` call with direct use of `placedFlowers` data
- Render each flower using `item.x`, `item.y`, `item.rotation`, `item.scale`, `item.flipped`, `item.z`
- Keep all existing SVG wrap, ribbon, stem, greenery layers unchanged
- Keep all existing CDN paths, filter definitions, animation variants
- Remove `backItems`/`midItems`/`frontItems` z-threshold splitting — render all flowers sorted by z
- Keep `AnimatePresence` for smooth add/remove transitions

**New rendering per flower:**
```jsx
<motion.img
  src={`${base}/flowers/${item.flowerId}.webp`}
  style={{
    left: `${(250 + item.x) * scale}px`,
    top: `${(210 + item.y) * scale}px`,
    transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scaleX(${item.flipped ? -1 : 1})`,
    width: `${getBouquetImgSize(item.flowerId) * item.scale * scale}px`,
    height: `${getBouquetImgSize(item.flowerId) * item.scale * scale}px`,
    zIndex: item.z,
  }}
/>
```

### 8. `src/utils/shareUrl.js` (MODIFIED)

**Encode additions:**
- `p` param: JSON array of placed flower data, base64url-encoded
  - Each flower: `[flowerId, x, y, rotation, scale, z, flipped]`
  - Compact format to keep URL manageable

**Decode additions:**
- Parse `p` param back to `PlacedFlower[]` array
- If `p` param missing (old shared link), generate random arrangement using simple scatter algorithm (not the old template system)
- Return `placedFlowers` in state object

**Backwards compatibility:**
- Old links without `p` param: generate random placement within safe area bounds
- New links include both `flowers` (for catalog) and `p` (for exact positions)

### 9. `src/App.jsx` (MODIFIED)

- Update `STEPS` array: remove SelectScreen, CustomizeScreen; add BuilderScreen
- New step mapping: `[LandingScreen, BuilderScreen, CardScreen, MusicScreen, WrapScreen, RibbonScreen, PreviewScreen, GardenScreen]`
- Update `decodeBouquetState` usage to handle `placedFlowers`
- Remove imports for deleted screens

### 10. `src/screens/PreviewScreen.jsx` (MODIFIED)

- Remove "Try Another Arrangement" button
- Use `placedFlowers` instead of `arrangementSeed`
- Pass `placedFlowers` to `BouquetPreview`
- Keep everything else unchanged

---

## Animations

### Flower pickup (drag start)
```jsx
whileTap={{ scale: 1.05 }}
transition={{ type: 'spring', stiffness: 400, damping: 25 }}
```

### Smooth drag motion
- Use `requestAnimationFrame` for pointer move updates
- No spring during drag (direct position tracking for 1:1 feel)

### Spring release (drop)
```jsx
animate={{ scale: 1 }}
transition={{ type: 'spring', stiffness: 300, damping: 20 }}
```

### Layer transition fade
```jsx
// When z-order changes:
animate={{ opacity: 1 }}
transition={{ duration: 0.2 }}
```

### Entry animation (new flower added)
```jsx
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ type: 'spring', stiffness: 200, damping: 22 }}
```

---

## Alignment Guides Implementation

```javascript
function computeGuides(draggedFlower, allFlowers, canvasWidth, canvasHeight) {
  const guides = [];
  const threshold = 6; // pixels
  const cx = 250 + draggedFlower.x;
  const cy = 210 + draggedFlower.y;

  // Center alignment
  if (Math.abs(cx - canvasWidth / 2) < threshold) {
    guides.push({ type: 'vertical', x: canvasWidth / 2 });
  }
  if (Math.abs(cy - canvasHeight * 0.35) < threshold) {
    guides.push({ type: 'horizontal', y: canvasHeight * 0.35 });
  }

  // Flower-to-flower alignment
  for (const other of allFlowers) {
    if (other.id === draggedFlower.id) continue;
    const ox = 250 + other.x;
    const oy = 210 + other.y;

    if (Math.abs(cx - ox) < threshold) {
      guides.push({ type: 'vertical', x: ox });
    }
    if (Math.abs(cy - oy) < threshold) {
      guides.push({ type: 'horizontal', y: oy });
    }
  }

  return guides;
}
```

**Guide rendering:**
- SVG overlay on canvas
- Vertical guides: `<line x1={g.x} y1={0} x2={g.x} y2={410} stroke="#000" strokeWidth="1" strokeDasharray="4 4" opacity="0.25" />`
- Horizontal guides: similar, horizontal

---

## Mobile Support Details

### Touch drag
- `onPointerDown/Move/Up` on each flower handles both mouse and touch natively

### Pinch to scale
```javascript
let initialPinchDistance = null;
let initialScale = null;

function onTouchMove(e) {
  if (e.touches.length === 2) {
    const dist = getDistance(e.touches[0], e.touches[1]);
    if (initialPinchDistance === null) {
      initialPinchDistance = dist;
      initialScale = selectedFlower.scale;
    }
    const newScale = initialScale * (dist / initialPinchDistance);
    dispatch({ type: 'SCALE_FLOWER', id: selectedFlower.id, scale: clamp(newScale, 0.5, 2.0) });
  }
}
```

### Two-finger rotate
```javascript
function getAngle(t1, t2) {
  return Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * (180 / Math.PI);
}

// In touchmove handler:
const angle = getAngle(e.touches[0], e.touches[1]);
const delta = angle - initialAngle;
dispatch({ type: 'ROTATE_FLOWER', id, delta });
```

### Responsive controls
- TransformControls: `flex-col` on desktop (right side), `flex-row` on mobile (bottom)
- Canvas scales with viewport (existing `scale` prop system)
- Touch targets minimum 44×44px for all buttons

---

## Constraints & Safe Area

### Bouquet design area bounds (in flower coordinate space)
```
x: [-150, 150]  (100px margin from 500px canvas edges)
y: [-120, 100]  (above wrap opening at y=278)
```

### Clamp function
```javascript
function clampPosition(x, y) {
  return {
    x: Math.max(-150, Math.min(150, x)),
    y: Math.max(-120, Math.min(100, y)),
  };
}
```

### Safe area visual indicator
- Dashed border rectangle at the bounds
- Color: `border-black/10`, `border-dashed`
- Only visible during active drag

---

## Implementation Order

### Phase 1: Data layer
1. Update `BouquetContext.jsx` — add `placedFlowers` state, remove `arrangementSeed`
2. Create `builderReducer.js` — all reducer actions
3. Update `shareUrl.js` — encode/decode placement data

### Phase 2: Core canvas
4. Create `FlowerElement.jsx` — individual flower rendering
5. Create `BuilderCanvas.jsx` — main canvas with drag handling + alignment guides
6. Update `BouquetPreview.jsx` — consume `placedFlowers` instead of arranger

### Phase 3: Builder screen
7. Create `TransformControls.jsx` — toolbar buttons
8. Create `BuilderScreen.jsx` — full screen layout
9. Update `App.jsx` — new step flow
10. Update `PreviewScreen.jsx` — remove arrangement references

### Phase 4: Polish
11. Add animations (pickup, spring release, entry)
12. Add mobile touch gestures (pinch, rotate)
13. Add alignment guides
14. Test and fix edge cases
15. Remove dead code (bouquetArranger.js, bouquetTemplates.js, deleted screens)

---

## Visual Design Constraints (PRESERVED)

- **Background:** `#F9F9EE` (cream)
- **Typography:** Space Mono, uppercase, `tracking-widest` / `tracking-[0.15em]`
- **Buttons:** Hard-edge (no border-radius), black bg with beige text, or transparent with black border
- **Shadows:** `shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]`
- **Flower images:** WebP from `assets.pauwee.com/{color|mono}/flowers/{id}.webp`
- **SVG wraps:** `feTurbulence` + `feDisplacementMap` filters (unchanged)
- **Greenery:** PNG overlays from CDN (unchanged)
- **User select:** Disabled globally (keep for canvas, but allow text selection in inputs)

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| URL length explosion from placement data | Use compact binary encoding, limit decimal places to 1 |
| Performance with many drag events | Use `requestAnimationFrame` throttling, update via refs during drag |
| Mobile gesture conflicts (scroll vs drag) | `touch-action: none` on canvas, `touch-action: pan-y` on catalog |
| Old shared links break | Fallback: generate random scatter placement when no `p` param |
| Z-index visual glitching | Pre-sort by z, render in back→front order within each layer group |
