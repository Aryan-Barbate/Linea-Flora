import { useBouquet } from '../context/BouquetContext';
import BouquetPreview from '../components/BouquetPreview';
import StepHeader from '../components/StepHeader';

export default function CustomizeScreen() {
  const { flowers, mode, setMode, greenery, setGreenery, arrangementSeed, shuffleArrangement, setStep, canProceed } = useBouquet();

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 min-h-screen">
      <StepHeader />

      <div className="flex flex-col mx-auto max-w-screen-lg w-full">
        <div className="p-6">
          <h2 className="mb-6 text-center font-mono text-xs tracking-[0.15em] uppercase">Customize Your Bouquet</h2>
          <div className="flex flex-col justify-center items-center space-y-4">
            <button
              onClick={() => setMode(mode === 'color' ? 'mono' : 'color')}
              className={`px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors duration-150 border ${
                mode === 'color'
                  ? 'bg-black text-beige border-black'
                  : 'bg-transparent text-black border-black/30 hover:border-black'
              }`}
            >
              {mode === 'color' ? 'Normal' : 'B&W'}
            </button>
            <button
              onClick={shuffleArrangement}
              className="px-5 py-3 font-mono text-xs uppercase tracking-widest bg-black text-beige border border-black"
            >
              Try a new Arrangement
            </button>
            <button
              onClick={() => setGreenery((greenery + 1) % 3)}
              className="px-5 py-3 font-mono text-xs uppercase tracking-widest text-black border border-black"
            >
              Change Greenery
            </button>
          </div>
        </div>

        <BouquetPreview
          flowers={flowers}
          mode={mode}
          greenery={greenery}
          arrangementSeed={arrangementSeed}
        />
      </div>

      <div className="flex flex-row gap-4 justify-center m-auto">
        <button
          onClick={() => setStep(1)}
          className="text-sm px-4 py-2 font-mono uppercase tracking-widest border border-black transition-colors duration-150"
        >
          BACK
        </button>
        <button
          onClick={() => {
            if (!canProceed) return;
            setStep(3);
          }}
          disabled={!canProceed}
          className={`text-sm px-4 py-2 font-mono uppercase tracking-widest transition-colors duration-150 ${
            canProceed ? 'bg-[#000000] text-beige' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
