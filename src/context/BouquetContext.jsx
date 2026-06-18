import { createContext, useContext, useState, useMemo } from 'react';

const BouquetContext = createContext(null);

export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 410;
export const CANVAS_CENTER_X = 250;
export const CANVAS_CENTER_Y = 210;
export const DEFAULT_FLOWER_SCALE = 1.0;

export function clampPosition(x, y) {
  return {
    x: Math.max(-150, Math.min(150, x)),
    y: Math.max(-120, Math.min(100, y)),
  };
}

export function getFlowerZIndex(placedFlowers) {
  if (placedFlowers.length === 0) return 1;
  return Math.max(...placedFlowers.map((f) => f.z)) + 1;
}

export const FLOWERS = [
  { id: 'orchid', name: 'Orchid', meaning: 'Beauty', birthMonth: 'October', size: 'medium' },
  { id: 'tulip', name: 'Tulip', meaning: 'Perfect love', birthMonth: 'April', size: 'medium' },
  { id: 'dahlia', name: 'Dahlia', meaning: 'Elegance', birthMonth: 'August', size: 'small' },
  { id: 'anemone', name: 'Anemone', meaning: 'Anticipation', birthMonth: 'September', size: 'medium' },
  { id: 'carnation', name: 'Carnation', meaning: 'Fascination', birthMonth: 'January', size: 'large' },
  { id: 'zinnia', name: 'Zinnia', meaning: 'Lasting Affection', birthMonth: 'July', size: 'medium' },
  { id: 'ranunculus', name: 'Ranunculus', meaning: 'Radiant Charm', birthMonth: 'March', size: 'medium' },
  { id: 'sunflower', name: 'Sunflower', meaning: 'Adoration', birthMonth: 'August', size: 'large' },
  { id: 'lily', name: 'Lily', meaning: 'Purity', birthMonth: 'May', size: 'large' },
  { id: 'daisy', name: 'Daisy', meaning: 'Innocence', birthMonth: 'April', size: 'small' },
  { id: 'peony', name: 'Peony', meaning: 'Romance', birthMonth: 'May', size: 'large' },
  { id: 'rose', name: 'Rose', meaning: 'Love and passion', birthMonth: 'June', size: 'medium' },
];

export const FLOWERS_BY_ID = Object.fromEntries(FLOWERS.map((f) => [f.id, f]));

export const WRAPS = [
  { id: 'ivory', name: 'Ivory White', color: '#F5F3EE', emoji: '🤍' },
  { id: 'dusty-rose', name: 'Dusty Rose', color: '#E8D3D0', emoji: '🩷' },
  { id: 'charcoal', name: 'Charcoal Black', color: '#3B3B3B', emoji: '🖤' },
  { id: 'kraft', name: 'Kraft Paper', color: '#D8C3A5', emoji: '💛' },
  { id: 'powder-blue', name: 'Powder Blue', color: '#D5E2E8', emoji: '💙' },
  { id: 'lavender', name: 'Soft Lavender', color: '#DDD6E8', emoji: '💜' },
];

export const RIBBON_MATERIALS = [
  { id: 'satin', name: 'Satin', description: 'Slight sheen, soft folds' },
  { id: 'velvet', name: 'Velvet', description: 'Matte, rich texture' },
  { id: 'silk', name: 'Silk', description: 'Lightweight, elegant folds' },
];

export const RIBBON_COLORS = [
  { id: 'white', name: 'White', hex: '#FFFFFF' },
  { id: 'black', name: 'Black', hex: '#1A1A1A' },
  { id: 'gold', name: 'Gold', hex: '#C5A55A' },
  { id: 'silver', name: 'Silver', hex: '#B0B0B0' },
  { id: 'pink', name: 'Pink', hex: '#E8A0B5' },
  { id: 'red', name: 'Red', hex: '#C05050' },
  { id: 'lavender', name: 'Lavender', hex: '#B8A9C9' },
  { id: 'navy', name: 'Navy', hex: '#3D4F6F' },
];

export const BACKGROUNDS = [
  { id: 'none', name: 'Soft Cream', description: 'Default cream background' },
  { id: 'vintage', name: 'Vintage Stationery', description: 'Faint aged paper lines' },
  { id: 'botanical', name: 'Botanical Journal', description: 'Subtle leaf impressions' },
  { id: 'handmade', name: 'Handmade Paper', description: 'Fibrous texture' },
  { id: 'antique', name: 'Antique Letter Paper', description: 'Yellowed elegance' },
];

export const MUSIC_CATEGORIES = [
  { id: 'romantic', label: 'Romantic', emoji: '💖' },
  { id: 'soft-piano', label: 'Soft Piano', emoji: '🌸' },
  { id: 'lofi', label: 'Lo-fi', emoji: '🌙' },
  { id: 'dreamy', label: 'Dreamy', emoji: '✨' },
  { id: 'instrumental', label: 'Instrumental', emoji: '☁️' },
  { id: 'acoustic', label: 'Acoustic', emoji: '🌿' },
];

export function getGridSize(id) {
  const f = FLOWERS.find((x) => x.id === id);
  return f?.size === 'small' ? 'w-32 h-32' : f?.size === 'large' ? 'w-48 h-48' : 'w-40 h-40';
}

export function getGridSizePx(id) {
  const f = FLOWERS.find((x) => x.id === id);
  return f?.size === 'small' ? 128 : f?.size === 'large' ? 192 : 160;
}

export function getBouquetImgSize(id) {
  const f = FLOWERS.find((x) => x.id === id);
  return f?.size === 'small' ? 80 : f?.size === 'large' ? 160 : 120;
}

export function BouquetProvider({ children, initialState }) {
  const [step, setStep] = useState(initialState?.step ?? 0);
  const [mode, setMode] = useState(initialState?.mode ?? 'color');
  const [placedFlowers, setPlacedFlowers] = useState(initialState?.placedFlowers ?? []);
  const [letter, setLetter] = useState(initialState?.letter ?? { sender: '', recipient: '', message: '' });
  const [greenery, setGreenery] = useState(initialState?.greenery ?? 0);

  const [music, setMusic] = useState(initialState?.music ?? { type: 'none', source: '', preset: '' });
  const [wrap, setWrap] = useState(initialState?.wrap ?? 'ivory');
  const [ribbon, setRibbon] = useState(initialState?.ribbon ?? { material: 'satin', color: 'white' });
  const [background, setBackground] = useState(initialState?.background ?? 'none');
  const [isSharedView, setIsSharedView] = useState(false);

  const totalFlowers = useMemo(() => placedFlowers.length, [placedFlowers]);
  const canProceed = totalFlowers >= 6 && totalFlowers <= 10;

  const value = useMemo(() => ({
    step, setStep,
    mode, setMode,
    placedFlowers, setPlacedFlowers,
    letter, setLetter,
    greenery, setGreenery,
    music, setMusic,
    wrap, setWrap,
    ribbon, setRibbon,
    background, setBackground,
    isSharedView, setIsSharedView,
    totalFlowers,
    canProceed,
  }), [step, mode, placedFlowers, letter, greenery, music, wrap, ribbon, background, isSharedView, totalFlowers, canProceed]);

  return (
    <BouquetContext.Provider value={value}>
      {children}
    </BouquetContext.Provider>
  );
}

export function useBouquet() {
  const ctx = useContext(BouquetContext);
  if (!ctx) throw new Error('useBouquet must be used within BouquetProvider');
  return ctx;
}
