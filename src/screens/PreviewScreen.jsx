import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBouquet } from '../context/BouquetContext';
import BouquetPreview from '../components/BouquetPreview';
import MusicPlayer from '../components/MusicPlayer';
import { createShareLink } from '../utils/shareUrl';

export default function PreviewScreen() {
  const { placedFlowers, mode, greenery, letter, music, wrap, ribbon, background, setStep, isSharedView } = useBouquet();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sharing, setSharing] = useState(false);

  const getShareUrl = async () => {
    setSharing(true);
    try {
      const url = await createShareLink(mode, placedFlowers, letter, { music, wrap, ribbon, background });
      return url;
    } finally {
      setSharing(false);
    }
  };

  const handleCopyLink = async () => {
    const url = await getShareUrl();
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
    const url = await getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Linea Flora', text: 'I made a bouquet for you!', url });
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
      <AnimatePresence>
        {isSharedView && !isOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.4, ease: 'easeInOut' } }}
            className="fixed inset-0 z-50 bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className="max-w-md w-full bg-white border border-black/10 p-8 sm:p-10 shadow-2xl relative flex flex-col items-center"
              style={{
                boxShadow: '0 20px 40px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              {/* Envelope Decorative Tape / Seal */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-[#F5F5DC] border border-black/5 rotate-[-1deg]" />
              
              <div className="font-mono text-[10px] tracking-[0.2em] text-black/40 uppercase mb-8">
                ✦ LINEA FLORA ✦
              </div>

              <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mb-6 text-2xl border border-black/5 animate-pulse">
                🌸
              </div>

              <h2 className="font-serif text-2xl text-black/80 mb-2 leading-snug">
                You've received a bouquet
              </h2>
              
              {(letter.recipient || letter.sender) && (
                <div className="my-6 py-4 border-y border-black/5 w-full font-mono text-xs text-black/60 space-y-1">
                  {letter.recipient && (
                    <div>
                      <span className="text-black/30">FOR:</span> {letter.recipient}
                    </div>
                  )}
                  {letter.sender && (
                    <div>
                      <span className="text-black/30">FROM:</span> {letter.sender}
                    </div>
                  )}
                </div>
              )}

              <p className="font-mono text-[10px] text-black/40 uppercase tracking-widest mb-8">
                {music && music.type !== 'none' 
                  ? "Contains background music" 
                  : "Contains a personal message"}
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsOpen(true)}
                className="w-full text-xs py-4 bg-black text-[#FDFBF7] hover:bg-black/90 font-mono uppercase tracking-widest transition-colors duration-150 shadow-md flex items-center justify-center gap-2"
              >
                <span>OPEN BOUQUET</span>
                {music && music.type !== 'none' && <span>♪</span>}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); setStep(0); }} 
          className="mt-4 inline-block text-center select-none"
        >
          <span className="font-mono text-lg uppercase tracking-[0.25em] font-bold text-black hover:opacity-75 transition-opacity duration-150">
            Linea Flora
          </span>
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

      {(!isSharedView || isOpen) && <MusicPlayer music={music} />}

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
            disabled={sharing}
            className="text-xs px-5 py-2.5 bg-[#000000] text-beige hover:bg-black/90 font-mono uppercase tracking-widest transition-colors duration-150 disabled:opacity-50 disabled:cursor-wait"
          >
            {sharing ? 'Saving…' : copied ? 'Copied!' : 'Copy Link'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            disabled={sharing}
            className="text-xs px-5 py-2.5 border border-black text-black hover:bg-[#F5F5AC]/90 font-mono uppercase tracking-widest transition-colors duration-150 disabled:opacity-50 disabled:cursor-wait"
          >
            {sharing ? 'Saving…' : 'Share'}
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
