import { useBouquet } from '../context/BouquetContext';
import GardenGrid from '../components/GardenGrid';

export default function GardenScreen() {
  const { setStep } = useBouquet();

  return (
    <div className="flex-1 flex flex-col items-center min-h-screen">
      <a href="/" onClick={(e) => { e.preventDefault(); setStep(0); }} className="mt-4">
        <img
          src="https://assets.pauwee.com/other/digibouquet.png"
          alt="digibouquet"
          width={200}
          height={80}
          className="object-cover mx-auto my-10 pointer-events-none select-none"
          draggable={false}
        />
      </a>

      <h2 className="text-md uppercase mb-4">
        OUR GARDEN
      </h2>
      <p className="text-sm opacity-50 mb-10">
        A peek at some of the bouquets people have made!
      </p>

      <GardenGrid />

      <div className="mt-8 mb-8">
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
