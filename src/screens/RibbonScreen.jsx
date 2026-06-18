import { motion } from 'framer-motion';
import { useBouquet, RIBBON_MATERIALS, RIBBON_COLORS } from '../context/BouquetContext';
import StepHeader from '../components/StepHeader';

function RibbonBow({ color, material }) {
  const ribbonColor = RIBBON_COLORS.find((c) => c.id === color)?.hex || '#FFFFFF';
  const darkRibbon = material === 'velvet' ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.05)';
  const sheen = material === 'satin' ? 'rgba(255,255,255,0.4)' : material === 'silk' ? 'rgba(255,255,255,0.2)' : 'transparent';
  const matOpacity = material === 'velvet' ? 0.95 : 1;

  return (
    <svg width="120" height="80" viewBox="0 0 120 80" className="pointer-events-none select-none">
      <defs>
        <linearGradient id={`sheen-${color}-${material}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={sheen} />
          <stop offset="50%" stopColor="transparent" />
          <stop offset="100%" stopColor={sheen} />
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="35" rx="28" ry="22" fill={ribbonColor} opacity={matOpacity} />
      <ellipse cx="30" cy="35" rx="28" ry="22" fill={`url(#sheen-${color}-${material})`} />
      <ellipse cx="90" cy="35" rx="28" ry="22" fill={ribbonColor} opacity={matOpacity} />
      <ellipse cx="90" cy="35" rx="28" ry="22" fill={`url(#sheen-${color}-${material})`} />
      <ellipse cx="60" cy="38" rx="10" ry="14" fill={ribbonColor} opacity={matOpacity} />
      <path d="M60 52 Q55 70 40 78" stroke={ribbonColor} strokeWidth="6" fill="none" strokeLinecap="round" opacity={matOpacity} />
      <path d="M60 52 Q65 70 80 78" stroke={ribbonColor} strokeWidth="6" fill="none" strokeLinecap="round" opacity={matOpacity} />
      <path d="M60 52 Q55 70 40 78" stroke={darkRibbon} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.3" />
      <path d="M60 52 Q65 70 80 78" stroke={darkRibbon} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.3" />
      <ellipse cx="60" cy="38" rx="5" ry="7" fill={darkRibbon} opacity="0.15" />
    </svg>
  );
}

export default function RibbonScreen() {
  const { ribbon, setRibbon, setStep } = useBouquet();

  const updateRibbon = (field, value) => {
    setRibbon((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 min-h-screen">
      <StepHeader />

      <div className="flex flex-col items-center w-full max-w-lg">
        <h2 className="font-mono text-xs tracking-[0.15em] uppercase my-8">CHOOSE RIBBON</h2>

        <p className="font-mono text-xs text-black/50 mb-8 text-center">
          Tie a ribbon around your bouquet.
        </p>

        <div className="w-full mb-6">
          <p className="font-mono text-xs text-black/40 uppercase tracking-widest mb-3">Material</p>
          <div className="grid grid-cols-3 gap-2">
            {RIBBON_MATERIALS.map((mat) => (
              <motion.button
                key={mat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateRibbon('material', mat.id)}
                className={`text-left px-3 py-3 border transition-colors duration-150 ${
                  ribbon.material === mat.id
                    ? 'bg-black text-beige border-black'
                    : 'bg-transparent text-black border-black/20 hover:border-black'
                }`}
              >
                <p className="font-mono text-xs uppercase tracking-widest">{mat.name}</p>
                <p className="font-mono text-[10px] mt-1 opacity-60">{mat.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="w-full mb-8">
          <p className="font-mono text-xs text-black/40 uppercase tracking-widest mb-3">Color</p>
          <div className="grid grid-cols-4 gap-2">
            {RIBBON_COLORS.map((c) => (
              <motion.button
                key={c.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateRibbon('color', c.id)}
                className={`relative p-3 border transition-all duration-150 flex flex-col items-center gap-2 ${
                  ribbon.color === c.id
                    ? 'border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]'
                    : 'border-black/20 hover:border-black/50'
                }`}
              >
                <div
                  className="w-8 h-3 rounded-sm"
                  style={{
                    backgroundColor: c.hex,
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), inset 0 -1px 2px rgba(0,0,0,0.1)',
                    border: c.id === 'white' ? '1px solid rgba(0,0,0,0.1)' : 'none',
                  }}
                />
                <span className="font-mono text-[10px] uppercase tracking-widest">{c.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <RibbonBow color={ribbon.color} material={ribbon.material} />
        </div>
      </div>

      <div className="flex flex-row gap-4 justify-center m-auto">
        <button
          onClick={() => setStep(4)}
          className="text-sm px-4 py-2 font-mono uppercase tracking-widest border border-black transition-colors duration-150"
        >
          BACK
        </button>
        <button
          onClick={() => setStep(6)}
          className="text-sm px-4 py-2 font-mono uppercase tracking-widest bg-[#000000] text-beige transition-colors duration-150"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
