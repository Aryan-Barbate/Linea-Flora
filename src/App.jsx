import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BouquetProvider, useBouquet } from './context/BouquetContext';
import { decodeBouquetState } from './utils/shareUrl';
import LandingScreen from './screens/LandingScreen';
import SelectScreen from './screens/SelectScreen';
import CustomizeScreen from './screens/CustomizeScreen';
import CardScreen from './screens/CardScreen';
import PreviewScreen from './screens/PreviewScreen';
import GardenScreen from './screens/GardenScreen';

const pageTransition = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

const STEPS = [
  LandingScreen,
  SelectScreen,
  CustomizeScreen,
  CardScreen,
  PreviewScreen,
  GardenScreen,
];

function AppContent() {
  const { step, setStep, setSelectedFlowers, setMode, setLetter } = useBouquet();

  useEffect(() => {
    const state = decodeBouquetState();
    if (state.selectedFlowers.length > 0) {
      setSelectedFlowers(state.selectedFlowers);
      setMode(state.mode);
      setLetter(state.letter);
      setStep(4);
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
