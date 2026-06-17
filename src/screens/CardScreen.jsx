import { useBouquet } from '../context/BouquetContext';
import StepHeader from '../components/StepHeader';

export default function CardScreen() {
  const { letter, setLetter, setStep } = useBouquet();

  const update = (field, value) => {
    setLetter((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 min-h-screen">
      <StepHeader />

      <div className="text-center w-full">
        <h2 className="font-mono text-xs tracking-[0.15em] uppercase my-8">WRITE THE CARD</h2>

        <div className="flex flex-row items-center justify-center">
          <div className="hidden md:flex flex-row items-center justify-center -space-x-12">
            <img
              src="https://assets.pauwee.com/full/flowers/daisy.webp"
              alt=""
              width={140}
              height={200}
              className="-rotate-12 hover:-translate-y-4 transition-all duration-300 pointer-events-none select-none"
              draggable={false}
            />
            <img
              src="https://assets.pauwee.com/full/flowers/lily.webp"
              alt=""
              width={140}
              height={200}
              className="-translate-y-5 hover:-translate-y-4 transition-all duration-300 pointer-events-none select-none"
              draggable={false}
            />
            <img
              src="https://assets.pauwee.com/full/flowers/anemone.webp"
              alt=""
              width={140}
              height={200}
              className="rotate-12 hover:-translate-y-4 transition-all duration-300 pointer-events-none select-none"
              draggable={false}
            />
          </div>

          <div className="bg-white border-2 border-black p-10 max-w-lg mx-4 md:mx-10 text-left">
            <div className="space-y-4">
              <div className="flex flex-row items-left justify-left gap-2 font-mono text-sm">
                <label htmlFor="recipient">Dear</label>
                <input
                  id="recipient"
                  value={letter.recipient}
                  onChange={(e) => update('recipient', e.target.value)}
                  placeholder="Beloved,"
                  className="border-none bg-transparent focus:outline-none focus:ring-0 font-mono text-sm"
                />
              </div>

              <div>
                <textarea
                  id="message"
                  value={letter.message}
                  onChange={(e) => update('message', e.target.value)}
                  placeholder="I have so much to tell you, but only this much space on this card! Still, you must know..."
                  rows={5}
                  className="w-full border-none bg-transparent focus:outline-none focus:ring-0 font-mono text-sm resize-none"
                />
              </div>

              <div className="flex flex-col items-right justify-end gap-2">
                <label htmlFor="sender" className="text-right font-mono text-sm">Sincerely,</label>
                <input
                  id="sender"
                  value={letter.sender}
                  onChange={(e) => update('sender', e.target.value)}
                  placeholder="Secret Admirer"
                  className="border-none bg-transparent text-right focus:outline-none focus:ring-0 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-row items-center justify-center -space-x-12">
            <img
              src="https://assets.pauwee.com/full/flowers/carnation.webp"
              alt=""
              width={140}
              height={200}
              className="-rotate-12 hover:-translate-y-4 transition-all duration-300 pointer-events-none select-none"
              draggable={false}
            />
            <img
              src="https://assets.pauwee.com/full/flowers/sunflower.webp"
              alt=""
              width={140}
              height={200}
              className="-translate-y-5 hover:-translate-y-4 transition-all duration-300 pointer-events-none select-none"
              draggable={false}
            />
            <img
              src="https://assets.pauwee.com/full/flowers/peony.webp"
              alt=""
              width={140}
              height={200}
              className="rotate-12 hover:-translate-y-4 transition-all duration-300 pointer-events-none select-none"
              draggable={false}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-4 justify-center m-auto mt-8">
        <button
          onClick={() => setStep(2)}
          className="text-sm px-4 py-2 font-mono uppercase tracking-widest border border-black transition-colors duration-150"
        >
          BACK
        </button>
        <button
          onClick={() => setStep(4)}
          className="text-sm px-4 py-2 font-mono uppercase tracking-widest bg-[#000000] text-beige transition-colors duration-150"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
