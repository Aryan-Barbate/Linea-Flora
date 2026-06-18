import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBouquet } from '../context/BouquetContext';
import BouquetPreview from '../components/BouquetPreview';
import MusicPlayer from '../components/MusicPlayer';
import { encodeBouquetState } from '../utils/shareUrl';

export default function PreviewScreen() {
  const { placedFlowers, mode, greenery, letter, music, wrap, ribbon, background, setStep } = useBouquet();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = encodeBouquetState(mode, placedFlowers, letter, { music, wrap, ribbon, background });
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    const url = encodeBouquetState(mode, placedFlowers, letter, { music, wrap, ribbon, background });
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Digibouquet', text: 'I made a bouquet for you!', url });
      } catch { /* share cancelled */ }
    } else {
      handleCopyLink();
    }
  };

  const bgClass = background === 'vintage' ? 'bg-vintage'
    : background === 'botanical' ? 'bg-botanical'
    : background === 'handmade' ? 'bg-handmade'
    : background === 'antique' ? 'bg-antique'
    : '';

  return (
    <div className={`flex-1 flex flex-col items-center px-4 py-4 min-h-screen ${bgClass}`}>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <a href="/" onClick={(e) => { e.preventDefault(); setStep(0); }} className="mt-4 inline-block">
          <img
            src="https://assets.pauwee.com/other/digibouquet.png"
            alt="digibouquet"
            width={160}
            height={64}
            className="object-cover pointer-events-none select-none"
            draggable={false}
          />
        </a>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="font-mono text-xs tracking-widest uppercase text-center mt-3 mb-4 text-black/50"
      >
        Hi, I made this bouquet for you!
      </motion.h2>

      <MusicPlayer music={music} />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center w-full max-w-5xl">
        {/* ── Bouquet ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center relative"
        >
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[280px] h-[40px] rounded-[50%] bg-black/[0.06] blur-xl pointer-events-none"
            aria-hidden
          />
          <BouquetPreview
            placedFlowers={placedFlowers}
            mode={mode}
            greenery={greenery}
            wrap={wrap}
            ribbon={ribbon}
            scale={1.1}
          />
        </motion.div>

        {/* ── Note Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center px-4"
        >
          <div
            className="relative bg-white border border-black/10 p-8 sm:p-10 text-left w-full max-w-md"
            style={{
              transform: 'rotate(-1.5deg)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#F5F5DC]/80 border border-black/5"
              style={{ transform: 'translateX(-50%) rotate(1deg)' }}
              aria-hidden
            />

            {letter.recipient && (
              <p className="font-mono text-base mb-4 text-black/80">Dear {letter.recipient},</p>
            )}
            {letter.message && (
              <p className="font-mono text-sm leading-[1.8] whitespace-pre-wrap mb-4 text-black/70">{letter.message}</p>
            )}
            {letter.sender && (
              <p className="font-mono text-sm text-black/60">With love, {letter.sender}</p>
            )}
            {!letter.recipient && !letter.message && !letter.sender && (
              <p className="font-mono text-sm text-black/20">...</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
        className="flex flex-col items-center gap-3 mt-6 mb-4"
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyLink}
            className="text-xs px-5 py-2.5 bg-[#000000] text-beige hover:bg-black/90 font-mono uppercase tracking-widest transition-colors duration-150"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            className="text-xs px-5 py-2.5 border border-black text-black hover:bg-[#F5F5AC]/90 font-mono uppercase tracking-widest transition-colors duration-150"
          >
            Share
          </motion.button>
        </div>
        <button
          onClick={() => setStep(0)}
          className="text-xs px-4 py-1.5 font-mono uppercase tracking-widest underline text-black/50 hover:text-black transition-colors"
        >
          Start Over
        </button>
      </motion.div>
    </div>
  );
}
