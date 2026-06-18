import { useBouquet } from '../context/BouquetContext';
import BouquetPreview from '../components/BouquetPreview';
import { encodeBouquetState } from '../utils/shareUrl';

export default function PreviewScreen() {
  const { flowers, mode, greenery, arrangementSeed, letter, shuffleArrangement, setStep } = useBouquet();

  const handleCopyLink = async () => {
    const url = encodeBouquetState(mode, flowers, letter);
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('Link copied to clipboard!');
    }
  };

  const handleShare = async () => {
    const url = encodeBouquetState(mode, flowers, letter);
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Digibouquet', text: 'I made a bouquet for you!', url });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-4 min-h-screen">
      <a href="/" onClick={(e) => { e.preventDefault(); setStep(0); }} className="mt-4">
        <img
          src="https://assets.pauwee.com/other/digibouquet.png"
          alt="digibouquet"
          width={160}
          height={64}
          className="object-cover pointer-events-none select-none"
          draggable={false}
        />
      </a>

      <h2 className="font-mono text-sm tracking-widest uppercase text-center mt-4 mb-2">
        Hi, I made this bouquet for you!
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center w-full max-w-5xl">
        <div className="flex justify-center -my-14">
          <BouquetPreview
            flowers={flowers}
            mode={mode}
            greenery={greenery}
            arrangementSeed={arrangementSeed}
          />
        </div>

        <div className="flex justify-center px-4">
          <div
            className="bg-white border-2 border-black p-8 text-left shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] max-w-md w-full"
            style={{ transform: 'rotate(-2deg)' }}
          >
            {letter.recipient && (
              <p className="font-mono text-sm mb-3">Dear {letter.recipient},</p>
            )}
            {letter.message && (
              <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap mb-3">{letter.message}</p>
            )}
            {letter.sender && (
              <p className="font-mono text-sm">Sincerely, {letter.sender}</p>
            )}
            {!letter.recipient && !letter.message && !letter.sender && (
              <p className="font-mono text-sm text-black/40">...</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
        <button
          onClick={handleCopyLink}
          className="text-sm px-6 py-3 bg-[#000000] text-beige hover:bg-black/90 font-mono uppercase tracking-widest transition-colors duration-150"
        >
          Copy Link
        </button>
        <button
          onClick={handleShare}
          className="text-sm px-6 py-3 border border-black text-black hover:bg-[#F5F5AC]/90 font-mono uppercase tracking-widest transition-colors duration-150"
        >
          Share
        </button>
        <button
          onClick={shuffleArrangement}
          className="text-sm px-6 py-3 border border-black text-black hover:bg-[#F5F5AC]/90 font-mono uppercase tracking-widest transition-colors duration-150"
        >
          Try Another Arrangement
        </button>
      </div>

      <div className="mt-4 mb-4">
        <button
          onClick={() => setStep(0)}
          className="text-sm px-4 py-2 font-mono uppercase tracking-widest underline text-black/60 hover:text-black transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
