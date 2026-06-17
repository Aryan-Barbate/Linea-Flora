import { useBouquet } from '../context/BouquetContext';

export default function StepHeader() {
  const { setStep } = useBouquet();

  return (
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
  );
}
