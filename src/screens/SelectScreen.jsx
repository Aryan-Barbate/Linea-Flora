import { useState } from 'react';
import { useBouquet } from '../context/BouquetContext';
import SelectionGrid from '../components/SelectionGrid';
import StepHeader from '../components/StepHeader';

export default function SelectScreen() {
  const { canProceed, setStep } = useBouquet();
  const [toast, setToast] = useState(null);

  const handleNext = () => {
    if (!canProceed) {
      setToast('you need 6-10 blooms to continue! add more or click the flower names to remove any extra');
      setTimeout(() => setToast(null), 1800);
      return;
    }
    setStep(2);
  };

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 min-h-screen">
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[10000] rounded-full bg-[#F9F9EE] text-black text-xs px-6 py-3 shadow-md border border-black text-center w-[85vw] max-w-sm font-mono">
          {toast}
        </div>
      )}

      <StepHeader />

      <div className="flex-grow py-8 w-full max-w-3xl text-center">
        <h2 className="mb-4 font-mono text-xs tracking-[0.15em] uppercase">Pick 6 to 10 BLOOMS</h2>
        <SelectionGrid />
      </div>

      <div className="flex flex-row gap-4 justify-center m-auto">
        <button
          onClick={handleNext}
          className={`text-sm px-4 py-2 font-mono uppercase tracking-widest transition-colors duration-150 ${
            canProceed ? 'bg-[#000000] text-beige' : 'bg-gray-300 text-gray-500 cursor-pointer'
          }`}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
