import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const BouquetContext = createContext(null);

export const FLOWERS = [
  { id: 'orchid', name: 'Orchid', meaning: 'Beauty', birthMonth: 'October', size: 'medium' },
  { id: 'tulip', name: 'Tulip', meaning: 'Perfect love', birthMonth: 'April', size: 'medium' },
  { id: 'dahlia', name: 'Dahlia', meaning: 'Elegance', birthMonth: 'August', size: 'small' },
  { id: 'anemone', name: 'Anemone', meaning: 'Anticipation', birthMonth: 'September', size: 'medium' },
  { id: 'carnation', name: 'Carnation', meaning: 'Fascination', birthMonth: 'January', size: 'large' },
  { id: 'zinnia', name: 'Zinnia', meaning: 'Lasting Affection', birthMonth: 'July', size: 'medium' },
  { id: 'ranunculus', name: 'Ranunculus', meaning: 'Radiant Charm', birthMonth: 'March', size: 'medium' },
  { id: 'sunflower', name: 'Sunflower', meaning: 'Adoration', birthMonth: 'August', size: 'large' },
  { id: 'lily', name: 'Lily', meaning: 'Purity', birthBirth: 'May', size: 'large' },
  { id: 'daisy', name: 'Daisy', meaning: 'Innocence', birthMonth: 'April', size: 'small' },
  { id: 'peony', name: 'Peony', meaning: 'Romance', birthMonth: 'May', size: 'medium' },
  { id: 'rose', name: 'Rose', meaning: 'Love and passion', birthMonth: 'June', size: 'medium' },
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
  const [selectedFlowers, setSelectedFlowers] = useState(initialState?.selectedFlowers ?? []);
  const [letter, setLetter] = useState(initialState?.letter ?? { sender: '', recipient: '', message: '' });
  const [greenery, setGreenery] = useState(initialState?.greenery ?? 0);
  const [arrangementSeed, setArrangementSeed] = useState(0);

  const totalFlowers = selectedFlowers.length;
  const canProceed = totalFlowers >= 6 && totalFlowers <= 10;

  const toggleFlower = useCallback((id) => {
    setSelectedFlowers((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 6) return prev;
        return prev.filter((f) => f !== id);
      }
      if (prev.length >= 10) return prev;
      return [...prev, id];
    });
  }, []);

  const shuffleArrangement = useCallback(() => {
    setArrangementSeed((s) => s + 1);
  }, []);

  const value = useMemo(() => ({
    step, setStep,
    mode, setMode,
    selectedFlowers, setSelectedFlowers,
    toggleFlower,
    letter, setLetter,
    greenery, setGreenery,
    arrangementSeed, setArrangementSeed,
    shuffleArrangement,
    totalFlowers,
    canProceed,
  }), [step, mode, selectedFlowers, toggleFlower, letter, greenery, arrangementSeed, shuffleArrangement, totalFlowers, canProceed]);

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
