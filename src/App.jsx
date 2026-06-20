import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BouquetProvider, useBouquet } from './context/BouquetContext';
import { decodeBouquetState, fetchSharedBouquet } from './utils/shareUrl';
import LandingScreen from './screens/LandingScreen';
import BuilderScreen from './screens/BuilderScreen';
import CardScreen from './screens/CardScreen';
import MusicScreen from './screens/MusicScreen';
import WrapScreen from './screens/WrapScreen';
import RibbonScreen from './screens/RibbonScreen';
import PreviewScreen from './screens/PreviewScreen';
import GardenScreen from './screens/GardenScreen';

const pageTransition = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

const STEPS = [
  LandingScreen,    // 0
  BuilderScreen,    // 1
  CardScreen,       // 2
  MusicScreen,      // 3
  WrapScreen,       // 4
  RibbonScreen,     // 5
  PreviewScreen,    // 6
  GardenScreen,     // 7
];

/**
 * Extract bouquet ID from a /b/:id URL path.
 * Returns the ID string or null if not a share URL.
 */
function getShareIdFromPath() {
  const match = window.location.pathname.match(/^\/b\/([a-zA-Z0-9_-]+)$/);
  return match ? match[1] : null;
}

/**
 * Check if the current URL has legacy query-string share data.
 */
function hasLegacyShareData() {
  const params = new URLSearchParams(window.location.search);
  return params.has('s') || params.has('flowers');
}

function BouquetNotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="max-w-md w-full bg-white border border-black/10 p-8 sm:p-10 shadow-2xl relative flex flex-col items-center"
        style={{
          boxShadow: '0 20px 40px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mb-6 text-3xl border border-black/5">
          🥀
        </div>

        <h2 className="font-serif text-2xl text-black/80 mb-3 leading-snug">
          Bouquet not found
        </h2>

        <p className="font-mono text-xs text-black/50 leading-relaxed mb-8 max-w-xs">
          This bouquet may have expired or the link might be invalid. Bouquets are available for 90 days after creation.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { window.location.href = '/'; }}
          className="w-full text-xs py-4 bg-black text-[#FDFBF7] hover:bg-black/90 font-mono uppercase tracking-widest transition-colors duration-150 shadow-md"
        >
          Create a New Bouquet
        </motion.button>
      </motion.div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2 border-black/10 border-t-black/60"
        />
        <p className="font-mono text-xs tracking-widest uppercase text-black/40">
          Loading bouquet…
        </p>
      </motion.div>
    </div>
  );
}

function AppContent() {
  const { step, setStep, setPlacedFlowers, setMode, setLetter, setMusic, setWrap, setRibbon, setBackground, setIsSharedView } = useBouquet();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadSharedBouquet() {
      // 1. Check for new /b/:id short URL format
      const shareId = getShareIdFromPath();
      if (shareId) {
        try {
          const state = await fetchSharedBouquet(shareId);
          if (state && state.placedFlowers.length > 0) {
            setPlacedFlowers(state.placedFlowers);
            setMode(state.mode);
            setLetter(state.letter);
            if (state.music) setMusic(state.music);
            if (state.wrap) setWrap(state.wrap);
            if (state.ribbon) setRibbon(state.ribbon);
            if (state.background) setBackground(state.background);
            setIsSharedView(true);
            setStep(6);
          } else {
            setNotFound(true);
          }
        } catch (err) {
          console.error('Failed to load shared bouquet:', err);
          setNotFound(true);
        }
        setLoading(false);
        return;
      }

      // 2. Check for legacy query-string share data (?s= or ?flowers=)
      if (hasLegacyShareData()) {
        const state = await decodeBouquetState();
        if (state.placedFlowers.length > 0) {
          setPlacedFlowers(state.placedFlowers);
          setMode(state.mode);
          setLetter(state.letter);
          if (state.music) setMusic(state.music);
          if (state.wrap) setWrap(state.wrap);
          if (state.ribbon) setRibbon(state.ribbon);
          if (state.background) setBackground(state.background);
          setIsSharedView(true);
          setStep(6);
        }
      }

      setLoading(false);
    }
    loadSharedBouquet();
  }, []);

  if (loading) {
    // Only show loading screen for /b/:id URLs (requires API fetch)
    const shareId = getShareIdFromPath();
    if (shareId) return <LoadingScreen />;
    // For other routes, don't show loading (legacy decode is near-instant)
  }

  if (notFound) {
    return <BouquetNotFound />;
  }

  const Screen = STEPS[step] || STEPS[0];

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          {...pageTransition}
          className="flex-1 flex flex-col"
        >
          <Screen />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BouquetProvider>
      <AppContent />
    </BouquetProvider>
  );
}
