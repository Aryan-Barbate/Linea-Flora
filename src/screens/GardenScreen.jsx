import { useBouquet } from '../context/BouquetContext';
import GardenGrid from '../components/GardenGrid';

export default function GardenScreen() {
  const { setStep } = useBouquet();

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 min-h-screen">
      <a href="/" onClick={(e) => { e.preventDefault(); setStep(0); }} className="mx-auto mt-6">
        <img
          src="https://assets.pauwee.com/other/digibouquet.png"
          alt="digibouquet"
          width={200}
          height={80}
          className="object-cover mx-auto pointer-events-none select-none"
          draggable={false}
        />
      </a>

      <h2 className="font-mono text-xs tracking-[0.15em] uppercase mt-10 mb-2">
        Our Garden
      </h2>
      <p className="font-mono text-[10px] tracking-widest uppercase text-black/50 mb-10">
        A peek at some of the bouquets people have made!
      </p>

      <GardenGrid />

      <div className="mt-10 mb-10">
        <button
          onClick={() => setStep(0)}
          className="text-sm px-4 py-2 font-mono uppercase tracking-widest underline text-black/60 hover:text-black transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
