import { motion } from 'framer-motion';
import { useBouquet, WRAPS } from '../context/BouquetContext';
import StepHeader from '../components/StepHeader';

export default function WrapScreen() {
  const { wrap, setWrap, setStep } = useBouquet();

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 min-h-screen">
      <StepHeader />

      <div className="flex flex-col items-center w-full max-w-lg">
        <h2 className="font-mono text-xs tracking-[0.15em] uppercase my-8">CHOOSE BOUQUET WRAP</h2>

        <p className="font-mono text-xs text-black/50 mb-8 text-center">
          Pick the paper that wraps your bouquet.
        </p>

        <div className="grid grid-cols-2 gap-3 w-full mb-8">
          {WRAPS.map((w) => (
            <motion.button
              key={w.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setWrap(w.id)}
              className={`relative text-left p-4 border transition-all duration-200 overflow-hidden ${
                wrap === w.id
                  ? 'border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]'
                  : 'border-black/20 hover:border-black/50'
              }`}
            >
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background: w.color,
                  backgroundImage: `
                    radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),
                    radial-gradient(ellipse at 80% 50%, rgba(0,0,0,0.05) 0%, transparent 50%),
                    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")
                  `,
                }}
              />
              <div className="relative z-10">
                <span className="text-lg mr-2">{w.emoji}</span>
                <span className="font-mono text-xs uppercase tracking-widest">{w.name}</span>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="relative w-[200px] h-[200px] mb-8">
          {(() => {
            const selectedWrap = WRAPS.find((w) => w.id === wrap);
            const wrapColor = selectedWrap?.color || '#F5F3EE';
            const filterId = `preview-${wrap}`;
            return (
              <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                <defs>
                  <filter id={`${filterId}-paper`} x="0%" y="0%" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" seed="3" result="noise" />
                    <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
                    <feBlend in="SourceGraphic" in2="gray" mode="multiply" />
                  </filter>
                  <filter id={`${filterId}-shadow`}>
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.08" />
                  </filter>
                  <clipPath id={`${filterId}-left`}>
                    <path d="M 30 68 L 65 65 L 62 188 L 35 185 Z" />
                  </clipPath>
                  <clipPath id={`${filterId}-right`}>
                    <path d="M 135 65 L 170 68 L 165 185 L 138 188 Z" />
                  </clipPath>
                  <clipPath id={`${filterId}-main`}>
                    <path d="M 38 65 L 162 65 L 115 190 L 85 190 Z" />
                  </clipPath>
                  <linearGradient id={`${filterId}-leftGrad`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.06)" />
                  </linearGradient>
                  <linearGradient id={`${filterId}-rightGrad`} x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.06)" />
                  </linearGradient>
                  <radialGradient id={`${filterId}-wc`} cx="35%" cy="45%" r="65%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                    <stop offset="40%" stopColor="rgba(255,255,255,0.04)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.03)" />
                  </radialGradient>
                </defs>

                <g filter={`url(#${filterId}-shadow)`}>
                  <g clipPath={`url(#${filterId}-left)`}>
                    <rect x="0" y="0" width="200" height="200" fill={wrapColor} opacity="0.75" filter={`url(#${filterId}-paper)`} />
                    <rect x="0" y="0" width="200" height="200" fill={`url(#${filterId}-leftGrad)`} />
                    <rect x="0" y="0" width="200" height="200" fill={`url(#${filterId}-wc)`} />
                  </g>
                  <g clipPath={`url(#${filterId}-right)`}>
                    <rect x="0" y="0" width="200" height="200" fill={wrapColor} opacity="0.75" filter={`url(#${filterId}-paper)`} />
                    <rect x="0" y="0" width="200" height="200" fill={`url(#${filterId}-rightGrad)`} />
                    <rect x="0" y="0" width="200" height="200" fill={`url(#${filterId}-wc)`} />
                  </g>
                  <g clipPath={`url(#${filterId}-main)`}>
                    <rect x="0" y="0" width="200" height="200" fill={wrapColor} opacity="0.88" filter={`url(#${filterId}-paper)`} />
                    <rect x="0" y="0" width="200" height="200" fill={`url(#${filterId}-wc)`} />
                    <rect x="0" y="0" width="200" height="200" fill="rgba(255,255,255,0.05)" />
                  </g>
                </g>

                <line x1="62" y1="66" x2="90" y2="189" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
                <line x1="138" y1="66" x2="110" y2="189" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
                <line x1="38" y1="65" x2="85" y2="190" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7" />
                <line x1="162" y1="65" x2="115" y2="190" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7" />
                <line x1="39" y1="66" x2="161" y2="66" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
              </svg>
            );
          })()}
        </div>
      </div>

      <div className="flex flex-row gap-4 justify-center m-auto">
        <button
          onClick={() => setStep(3)}
          className="text-sm px-4 py-2 font-mono uppercase tracking-widest border border-black transition-colors duration-150"
        >
          BACK
        </button>
        <button
          onClick={() => setStep(5)}
          className="text-sm px-4 py-2 font-mono uppercase tracking-widest bg-[#000000] text-beige transition-colors duration-150"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
