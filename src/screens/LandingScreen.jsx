import { useBouquet } from '../context/BouquetContext';

export default function LandingScreen() {
  const { setStep, setMode } = useBouquet();

  const startNormal = () => {
    setMode('color');
    setStep(1);
  };

  const startBW = () => {
    setMode('mono');
    setStep(1);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
      <div className="p-16 mx-auto max-w-3xl text-center">
        <picture>
          <source srcSet="https://assets.pauwee.com/color/flowers/peony.webp" type="image/webp" />
          <img
            src="https://assets.pauwee.com/color/flowers/peony.webp"
            alt="peony flower"
            width={100}
            height={100}
            className="object-cover mx-auto mb-6"
            draggable={false}
          />
        </picture>

        <img
          src="https://assets.pauwee.com/other/digibouquet.png"
          alt="digibouquet"
          width={600}
          height={400}
          className="object-cover mx-auto"
          draggable={false}
        />

        <p className="my-6 text-sm font-mono uppercase tracking-wider md:mb-6 md:-mt-6">
          beautiful flowers <br /> delivered digitally
        </p>

        <div className="flex flex-col justify-center items-center">
          <button
            onClick={startNormal}
            className="text-sm px-8 py-4 bg-[#000000] text-beige hover:bg-black/90 m-2 font-mono uppercase tracking-widest transition-colors duration-150"
          >
            BUILD A BOUQUET
          </button>
          <button
            onClick={startBW}
            className="text-sm px-8 py-4 border border-black text-black hover:bg-[#F5F5AC]/90 m-2 font-mono uppercase tracking-widest transition-colors duration-150"
          >
            BUILD IT IN BLACK AND WHITE
          </button>
          <button
            onClick={() => setStep(5)}
            className="text-sm px-8 py-4 underline text-black m-2 font-mono uppercase tracking-widest transition-opacity duration-150 hover:opacity-80"
          >
            VIEW GARDEN
          </button>
        </div>

        <p className="mt-10 text-sm text-gray-500 font-mono text-xs tracking-wider">
          made by{' '}
          <a
            href="https://x.com/pau_wee_"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-gray-500"
          >
            @pau_wee_
          </a>
        </p>
      </div>
    </div>
  );
}
