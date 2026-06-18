import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBouquet, MUSIC_CATEGORIES } from '../context/BouquetContext';
import StepHeader from '../components/StepHeader';

export default function MusicScreen() {
  const { music, setMusic, setStep } = useBouquet();
  const [inputUrl, setInputUrl] = useState(music.source || '');

  const resolveSourceType = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('spotify.com') || url.includes('open.spotify.com')) return 'spotify';
    return 'custom';
  };

  const handleUrlSubmit = () => {
    const type = resolveSourceType(inputUrl);
    if (!type) return;
    setMusic({ type, source: inputUrl, preset: music.preset || '' });
  };

  const handlePreset = (cat) => {
    setMusic({ type: 'preset', source: '', preset: cat.id });
    setInputUrl('');
  };

  const handleNoMusic = () => {
    setMusic({ type: 'none', source: '', preset: '' });
    setInputUrl('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleUrlSubmit();
  };

  const detectedType = resolveSourceType(inputUrl);

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 min-h-screen">
      <StepHeader />

      <div className="flex flex-col items-center w-full max-w-lg">
        <h2 className="font-mono text-xs tracking-[0.15em] uppercase my-8">CHOOSE MUSIC</h2>

        <p className="font-mono text-xs text-black/50 mb-8 text-center">
          Add a song to play when your bouquet is opened.
        </p>

        <div className="w-full space-y-3 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNoMusic}
            className={`w-full text-left px-5 py-3 font-mono text-xs uppercase tracking-widest border transition-colors duration-150 ${
              music.type === 'none'
                ? 'bg-black text-beige border-black'
                : 'bg-transparent text-black border-black/20 hover:border-black'
            }`}
          >
            No Music
          </motion.button>

          <div className="border border-black/10 p-4 mt-4">
            <p className="font-mono text-xs text-black/40 uppercase tracking-widest mb-3">Spotify or YouTube Link</p>
            <div className="flex gap-2">
              <input
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste link here..."
                className="flex-1 border border-black/20 px-3 py-2 font-mono text-xs bg-transparent focus:outline-none focus:border-black/50"
              />
              <button
                onClick={handleUrlSubmit}
                disabled={!inputUrl || !detectedType}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-widest border transition-colors duration-150 ${
                  inputUrl && detectedType
                    ? 'border-black hover:bg-black hover:text-beige'
                    : 'border-black/20 text-black/30 cursor-not-allowed'
                }`}
              >
                Set
              </button>
            </div>
            <AnimatePresence>
              {inputUrl && detectedType && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="font-mono text-[10px] text-black/40 mt-2"
                >
                  Detected: {detectedType === 'youtube' ? 'YouTube' : detectedType === 'spotify' ? 'Spotify' : 'Audio URL'}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="border border-black/10 p-4 mt-4">
            <p className="font-mono text-xs text-black/40 uppercase tracking-widest mb-3">Preset Music</p>
            <div className="grid grid-cols-2 gap-2">
              {MUSIC_CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePreset(cat)}
                  className={`text-left px-4 py-2.5 font-mono text-xs border transition-colors duration-150 ${
                    music.type === 'preset' && music.preset === cat.id
                      ? 'bg-black text-beige border-black'
                      : 'bg-transparent text-black border-black/20 hover:border-black'
                  }`}
                >
                  <span className="mr-1">{cat.emoji}</span> {cat.label}
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {music.type === 'preset' && music.preset && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3"
                >
                  <p className="font-mono text-[10px] text-black/40 mb-2">
                    Paste a {MUSIC_CATEGORIES.find((c) => c.id === music.preset)?.label} song link above, or leave as-is for the mood label only.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {music.type !== 'none' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center gap-2 mb-8 font-mono text-xs text-black/40"
            >
              <span>♪</span>
              <span className="uppercase tracking-widest">
                {music.type === 'preset'
                  ? MUSIC_CATEGORIES.find((c) => c.id === music.preset)?.label || 'Preset'
                  : detectedType === 'youtube'
                  ? 'YouTube'
                  : detectedType === 'spotify'
                  ? 'Spotify'
                  : 'Custom Audio'
                }
              </span>
              {music.source && (
                <span className="text-black/30 text-[10px]">• ready</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-row gap-4 justify-center m-auto">
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
