import { useBouquet } from '../context/BouquetContext';
import GardenGrid from '../components/GardenGrid';

export default function GardenScreen() {
  const { setStep } = useBouquet();

  return (
    <div className="flex-1 flex flex-col items-center min-h-screen">
      <a 
        href="/" 
        onClick={(e) => { e.preventDefault(); setStep(0); }} 
        className="mt-6 block text-center select-none"
      >
        <span className="font-mono text-xl uppercase tracking-[0.25em] font-bold text-black hover:opacity-75 transition-opacity duration-150">
          Linea Flora
        </span>
      </a>

      <h2 className="font-mono text-sm uppercase tracking-[0.2em] mt-6 mb-2">OUR GARDEN</h2>
      <p className="font-mono text-xs opacity-40 mb-8 text-center px-4">
        A peek at some of the bouquets people have made!
      </p>

      <GardenGrid />

      <div className="mt-6 mb-8">
        <button
          onClick={() => setStep(0)}
          className="text-sm px-4 py-2 font-mono uppercase tracking-widest underline text-black/50 hover:text-black transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
