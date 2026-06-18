import { getBouquetImgSize } from '../context/BouquetContext';
import TEMPLATES from './bouquetTemplates';

function createRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const FOCAL_FLOWERS = new Set(['sunflower', 'lily']);

const SLOT_BY_ROLE = {
  focal:    4,
  secondary: [3, 5],
  upper:    [1, 2],
  lower:    [6, 7],
  accent:   [0, 8, 9],
};

function getSizeScore(id) {
  const px = getBouquetImgSize(id);
  if (FOCAL_FLOWERS.has(id)) return px + 100;
  return px;
}

function getFlowerScale(id) {
  if (id === 'sunflower' || id === 'lily') return 1.05;
  if (id === 'daisy' || id === 'dahlia') return 0.75;
  return 0.88;
}

export function arrangeBouquet(flowerIds, seed = 0, scaleFactor = 1.0) {
  if (!flowerIds || flowerIds.length === 0) return [];

  const unique = [...new Set(flowerIds)];
  const N = unique.length;
  if (N < 1 || N > 10) return [];

  const rng = createRng(seed * 37 + 11);
  const templateIndex = Math.floor(rng() * TEMPLATES.length);
  const template = TEMPLATES[templateIndex];

  const sorted = [...unique].sort((a, b) => getSizeScore(b) - getSizeScore(a));

  const assignments = new Array(N).fill(null);
  const usedSlots = new Set();

  function assignSlot(slotIdx) {
    if (slotIdx >= N || usedSlots.has(slotIdx)) return false;
    for (let f = 0; f < sorted.length; f++) {
      if (assignments[f] !== null) continue;
      assignments[f] = slotIdx;
      usedSlots.add(slotIdx);
      return true;
    }
    return false;
  }

  assignSlot(SLOT_BY_ROLE.focal);

  for (const idx of SLOT_BY_ROLE.secondary) {
    if (usedSlots.has(idx)) continue;
    for (let f = 0; f < sorted.length; f++) {
      if (assignments[f] !== null) continue;
      assignments[f] = idx;
      usedSlots.add(idx);
      break;
    }
    if (usedSlots.size >= N) break;
  }

  const remainingSlots = [];
  for (const group of [SLOT_BY_ROLE.upper, SLOT_BY_ROLE.lower, SLOT_BY_ROLE.accent]) {
    for (const idx of group) {
      if (!usedSlots.has(idx) && idx < N) {
        remainingSlots.push(idx);
      }
    }
  }

  for (const slotIdx of remainingSlots) {
    if (usedSlots.size >= N) break;
    for (let f = 0; f < sorted.length; f++) {
      if (assignments[f] !== null) continue;
      assignments[f] = slotIdx;
      usedSlots.add(slotIdx);
      break;
    }
  }

  const flowerSlotMap = [];
  for (let f = 0; f < sorted.length; f++) {
    if (assignments[f] !== null) {
      flowerSlotMap.push({ flowerId: sorted[f], slotIdx: assignments[f] });
    }
  }

  const result = [];

  for (const { flowerId, slotIdx } of flowerSlotMap) {
    const slot = template.slots[slotIdx];

    const jx = (rng() - 0.5) * 4;
    const jy = (rng() - 0.5) * 4;
    const jr = (rng() - 0.5) * 10;
    const js = (rng() - 0.5) * 0.06;

    const baseSize = getBouquetImgSize(flowerId);
    const baseScale = getFlowerScale(flowerId);
    const finalScale = (slot.scale + js) * baseScale;
    const size = Math.round(baseSize * finalScale * scaleFactor);

    result.push({
      id: flowerId,
      x: Math.round((slot.x + jx) * 10) / 10,
      y: Math.round((slot.y + jy) * 10) / 10,
      z: slot.z,
      rot: Math.round((slot.rot + jr) * 10) / 10,
      size,
    });
  }

  return result.sort((a, b) => a.z - b.z);
}
