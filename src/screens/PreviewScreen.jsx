import { useBouquet } from '../context/BouquetContext';
import BouquetPreview from '../components/BouquetPreview';
import { encodeBouquetState } from '../utils/shareUrl';

export default function PreviewScreen() {
  const { selectedFlowers, mode, greenery, arrangementSeed, letter, shuffleArrangement, setStep } = useBouquet();

  const handleCopyLink = async () => {
    const url = encodeBouquetState(mode, selectedFlowers, letter);
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

      <h2 className="font-mono text-sm tracking-widest uppercase text-center mt-10 mb-8">
        Hi, I made this bouquet for you!
      </h2>

      <div className="w-full max-w-lg">
        <BouquetPreview
          selectedFlowers={selectedFlowers}
          mode={mode}
          greenery={greenery}
          arrangementSeed={arrangementSeed}
        />
      </div>

      <div className="mb-10 w-full max-w-md px-4">
        <div className="bg-white border-2 border-black p-6 text-center" style={{ transform: 'rotate(-0.5deg)' }}>
          {letter.recipient && (
            <p className="font-mono text-sm mb-2">Dear {letter.recipient},</p>
          )}
          {letter.message && (
            <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">{letter.message}</p>
          )}
          {letter.sender && (
            <p className="font-mono text-sm mt-2">Sincerely, {letter.sender}</p>
          )}
          {!letter.recipient && !letter.message && !letter.sender && (
            <p className="font-mono text-sm text-black/40">...</p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={handleCopyLink}
          className="text-sm px-8 py-4 bg-[#000000] text-beige hover:bg-black/90 font-mono uppercase tracking-widest transition-colors duration-150"
        >
          Copy Link
        </button>
        <button
          onClick={handleShare}
          className="text-sm px-8 py-4 border border-black text-black hover:bg-[#F5F5AC]/90 font-mono uppercase tracking-widest transition-colors duration-150"
        >
          Share
        </button>
        <button
          onClick={shuffleArrangement}
          className="text-sm px-8 py-4 border border-black text-black hover:bg-[#F5F5AC]/90 font-mono uppercase tracking-widest transition-colors duration-150"
        >
          Try Another Arrangement
        </button>
      </div>

      <div className="mt-8">
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
