import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BouquetProvider, useBouquet } from './context/BouquetContext';
import { decodeBouquetState } from './utils/shareUrl';
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

function AppContent() {
  const { step, setStep, setPlacedFlowers, setMode, setLetter, setMusic, setWrap, setRibbon, setBackground } = useBouquet();

  useEffect(() => {
    const state = decodeBouquetState();
    if (state.placedFlowers.length > 0) {
      setPlacedFlowers(state.placedFlowers);
      setMode(state.mode);
      setLetter(state.letter);
      if (state.music) setMusic(state.music);
      if (state.wrap) setWrap(state.wrap);
      if (state.ribbon) setRibbon(state.ribbon);
      if (state.background) setBackground(state.background);
      setStep(6);
    }
  }, []);

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
