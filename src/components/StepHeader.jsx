import { useBouquet } from '../context/BouquetContext';

export default function StepHeader() {
  const { setStep } = useBouquet();

  return (
    <a 
      href="/" 
      onClick={(e) => { e.preventDefault(); setStep(0); }} 
      className="mx-auto mt-6 block text-center select-none"
    >
      <span className="font-mono text-xl sm:text-2xl uppercase tracking-[0.25em] font-bold text-black hover:opacity-75 transition-opacity duration-150">
        Linea Flora
      </span>
    </a>
  );
}
