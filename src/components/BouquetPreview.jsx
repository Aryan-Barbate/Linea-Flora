import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBouquetImgSize } from '../context/BouquetContext';
import { WRAPS, RIBBON_COLORS } from '../context/BouquetContext';

const CDN = {
  color: 'https://assets.pauwee.com/color',
  mono:  'https://assets.pauwee.com/mono',
};

function createRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function BackWrap({ wrapId, scale = 1 }) {
  const wrap = WRAPS.find((w) => w.id === wrapId);
  if (!wrap) return null;
  const c    = wrap.color;
  const fOrg = `bw-org-${wrapId}`;
  const fShd = `bw-shd-${wrapId}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="absolute inset-0 pointer-events-none select-none"
      style={{ zIndex: 5 }}
    >
      <svg
        width={500 * scale}
        height={410 * scale}
        viewBox="0 0 500 410"
        style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}
      >
        <defs>
          <filter id={fOrg} x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03 0.045"
              numOctaves="4"
              seed="17"
              result="disp"
            />
            <feDisplacementMap
              in="SourceGraphic" in2="disp"
              scale="6"
              xChannelSelector="R" yChannelSelector="G"
              result="warped"
            />
            <feGaussianBlur in="warped" stdDeviation="0.55" />
          </filter>

          <filter id={fShd} x="-12%" y="-12%" width="124%" height="124%">
            <feDropShadow dx="1" dy="5" stdDeviation="7"
              floodColor="#A08862" floodOpacity="0.16" />
          </filter>
        </defs>

        <g filter={`url(#${fShd})`}>
          <path
            d="M 115 282 L 238 274 L 244 396 L 198 400 Z"
            fill={c} opacity="0.94"
            filter={`url(#${fOrg})`}
          />
          <line x1="115" y1="282" x2="198" y2="400"
            stroke="rgba(0,0,0,0.10)" strokeWidth="1.2" />

          <path
            d="M 385 282 L 262 274 L 256 396 L 302 400 Z"
            fill={c} opacity="0.94"
            filter={`url(#${fOrg})`}
          />
          <line x1="385" y1="282" x2="302" y2="400"
            stroke="rgba(0,0,0,0.10)" strokeWidth="1.2" />

          <path
            d="M 178 278 L 322 278 L 274 346 L 270 400 L 230 400 L 226 346 Z"
            fill={c} opacity="0.97"
            filter={`url(#${fOrg})`}
          />
          <path d="M 178 278 Q 250 283 322 278"
            stroke="rgba(0,0,0,0.09)" strokeWidth="2" fill="none" />
        </g>

        <path
          d="M 180 277 Q 250 271 320 277"
          stroke="rgba(255,255,255,0.38)" strokeWidth="1.4" fill="none"
        />
        <line x1="178" y1="278" x2="226" y2="346" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
        <line x1="322" y1="278" x2="274" y2="346" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
        <line x1="222" y1="346" x2="226" y2="400" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7" />
        <line x1="278" y1="346" x2="274" y2="400" stroke="rgba(0,0,0,0.07)" strokeWidth="0.7" />
      </svg>
    </motion.div>
  );
}

export function FrontWrap({ wrapId, scale = 1 }) {
  const wrap = WRAPS.find((w) => w.id === wrapId);
  if (!wrap) return null;
  const c    = wrap.color;
  const fOrg = `fw-org-${wrapId}`;
  const fShd = `fw-shd-${wrapId}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.07, ease: 'easeOut' }}
      className="absolute inset-0 pointer-events-none select-none"
      style={{ zIndex: 55 }}
    >
      <svg
        width={500 * scale}
        height={410 * scale}
        viewBox="0 0 500 410"
        style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}
      >
        <defs>
          <filter id={fOrg} x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03 0.045"
              numOctaves="4"
              seed="31"
              result="disp"
            />
            <feDisplacementMap
              in="SourceGraphic" in2="disp"
              scale="5"
              xChannelSelector="R" yChannelSelector="G"
              result="warped"
            />
            <feGaussianBlur in="warped" stdDeviation="0.5" />
          </filter>
          <filter id={fShd} x="-12%" y="-12%" width="124%" height="124%">
            <feDropShadow dx="0" dy="4" stdDeviation="6"
              floodColor="#A08862" floodOpacity="0.14" />
          </filter>
        </defs>

        <g filter={`url(#${fShd})`}>
          <path
            d="M 226 400 L 132 318 L 176 274 L 250 280 L 248 400 Z"
            fill={c} opacity="0.93"
            filter={`url(#${fOrg})`}
          />
          <path d="M 132 318 L 176 274"
            stroke="rgba(255,255,255,0.26)" strokeWidth="1" fill="none" />
          <line x1="176" y1="274" x2="250" y2="280"
            stroke="rgba(0,0,0,0.06)" strokeWidth="0.8" />

          <path
            d="M 274 400 L 368 318 L 324 274 L 250 280 L 252 400 Z"
            fill={c} opacity="0.97"
            filter={`url(#${fOrg})`}
          />
          <path d="M 368 318 L 324 274"
            stroke="rgba(255,255,255,0.26)" strokeWidth="1" fill="none" />
          <line x1="324" y1="274" x2="250" y2="280"
            stroke="rgba(0,0,0,0.06)" strokeWidth="0.8" />

          <path d="M 250 276 L 250 400"
            stroke="rgba(0,0,0,0.08)" strokeWidth="1.1" fill="none" />

          <path
            d="M 222 398 L 278 398 L 286 410 L 214 410 Z"
            fill={c} opacity="0.90"
            filter={`url(#${fOrg})`}
          />
          <line x1="250" y1="398" x2="250" y2="410"
            stroke="rgba(0,0,0,0.05)" strokeWidth="0.8" />
        </g>
      </svg>
    </motion.div>
  );
}

export function RibbonLayer({ color, material, scale = 1 }) {
  const ribbonColor = RIBBON_COLORS.find((c) => c.id === color)?.hex || '#FFFFFF';
  const darkTone    = material === 'velvet' ? 'rgba(0,0,0,0.22)' : 'rgba(0,0,0,0.08)';
  const sheen       = material === 'satin'  ? 0.38 : material === 'silk' ? 0.22 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.18, ease: 'easeOut' }}
      className="absolute pointer-events-none select-none"
      style={{
        top:       `${324 * scale}px`,
        left:      `${250 * scale}px`,
        transform: 'translateX(-50%)',
        width:     `${96 * scale}px`,
        height:    `${58 * scale}px`,
        zIndex:    60,
      }}
    >
      <svg width={96 * scale} height={58 * scale} viewBox="0 0 96 58">
        <defs>
          <linearGradient id={`rbn-${color}-${material}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={`rgba(255,255,255,${sheen})`} />
            <stop offset="45%"  stopColor="transparent" />
            <stop offset="100%" stopColor={`rgba(255,255,255,${sheen})`} />
          </linearGradient>
        </defs>

        <path d="M42 32 Q36 46 22 54" stroke={ribbonColor} strokeWidth="4"  fill="none" strokeLinecap="round" />
        <path d="M42 32 Q36 46 22 54" stroke={darkTone}    strokeWidth="4"  fill="none" strokeLinecap="round" opacity="0.28" />
        <path d="M54 32 Q60 46 74 54" stroke={ribbonColor} strokeWidth="4"  fill="none" strokeLinecap="round" />
        <path d="M54 32 Q60 46 74 54" stroke={darkTone}    strokeWidth="4"  fill="none" strokeLinecap="round" opacity="0.28" />

        <ellipse cx="27" cy="21" rx="19" ry="14" fill={ribbonColor} />
        <ellipse cx="27" cy="21" rx="19" ry="14" fill={`url(#rbn-${color}-${material})`} />
        <ellipse cx="27" cy="21" rx="19" ry="14" fill={darkTone} opacity="0.07" />
        <ellipse cx="69" cy="21" rx="19" ry="14" fill={ribbonColor} />
        <ellipse cx="69" cy="21" rx="19" ry="14" fill={`url(#rbn-${color}-${material})`} />
        <ellipse cx="69" cy="21" rx="19" ry="14" fill={darkTone} opacity="0.07" />

        <ellipse cx="48" cy="23" rx="6" ry="9" fill={ribbonColor} />
        <ellipse cx="48" cy="23" rx="6" ry="9" fill={darkTone} opacity="0.10" />

        <path d="M11 17 Q19 21 27 15" stroke={darkTone} strokeWidth="0.7" fill="none" opacity="0.14" />
        <path d="M85 17 Q77 21 69 15" stroke={darkTone} strokeWidth="0.7" fill="none" opacity="0.14" />
      </svg>
    </motion.div>
  );
}

export function StemsLayer({ items, scale = 1 }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      style={{ zIndex: 12 }}
    >
      <svg
        width={500 * scale}
        height={410 * scale}
        viewBox="0 0 500 410"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {items.map((item) => {
          const fx = (250 + item.x) * scale;
          const fy = (210 + item.y) * scale;
          const bx = (250 - item.x * 0.12) * scale;
          const by = 405 * scale;
          const cx = (250 + item.x * 0.15) * scale;
          const cy = 278 * scale;

          return (
            <g key={`stem-${item.id}`}>
              <path
                d={`M ${fx} ${fy} Q ${cx} ${cy} ${bx} ${by}`}
                stroke="#4E6338"
                strokeWidth={2.6 * scale}
                strokeLinecap="round"
                fill="none"
                opacity={0.85}
              />
              <path
                d={`M ${fx} ${fy} Q ${cx} ${cy} ${bx} ${by}`}
                stroke="#324021"
                strokeWidth={0.8 * scale}
                strokeLinecap="round"
                fill="none"
                opacity={0.4}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function BouquetPreview({ placedFlowers, mode, greenery, wrap, ribbon, scale = 1, seed = 0 }) {
  const base     = CDN[mode] || CDN.color;
  const bushline = greenery + 1;

  const { greeneryOffset } = useMemo(() => {
    const rng = createRng(seed * 73 + 29);
    return { greeneryOffset: (rng() - 0.5) * 6 };
  }, [seed]);

  const stemItems = useMemo(() =>
    placedFlowers.map((f) => ({ id: f.id, x: f.x, y: f.y })),
    [placedFlowers]
  );

  const sortedFlowers = useMemo(() =>
    [...placedFlowers].sort((a, b) => a.z - b.z),
    [placedFlowers]
  );

  const containerWidth  = 500 * scale;
  const containerHeight = 410 * scale;

  return (
    <div className="flex relative justify-center items-center py-4"
      style={{ minHeight: containerHeight + 60 }}>
      <div className="relative" style={{ width: containerWidth, minHeight: containerHeight }}>

        <StemsLayer items={stemItems} scale={scale} />

        {wrap && <BackWrap wrapId={wrap} scale={scale} />}

        <img
          src={`${base}/bush/bush-${bushline}.png`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{
            zIndex:    10,
            transform: `translateX(${greeneryOffset}%) translateY(-8%) scale(0.55)`,
            opacity:   0.65,
          }}
          draggable={false}
        />

        <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 14 }}>
          <AnimatePresence mode="popLayout">
            {sortedFlowers
              .filter((f) => f.z < 10)
              .map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                  className="absolute"
                  style={{
                    left:      `${(250 + item.x) * scale}px`,
                    top:       `${(210 + item.y) * scale}px`,
                    transform: 'translate(-50%, -50%)',
                    zIndex:    item.z,
                  }}
                >
                  <img
                    src={`${base}/flowers/${item.flowerId}.webp`}
                    alt={item.flowerId}
                    width={getBouquetImgSize(item.flowerId) * item.scale * scale}
                    height={getBouquetImgSize(item.flowerId) * item.scale * scale}
                    className="pointer-events-none select-none"
                    style={{
                      transform: `rotate(${item.rotation}deg) scaleX(${item.flipped ? -1 : 1})`,
                      filter: 'brightness(0.93)',
                    }}
                    draggable={false}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 23 }}>
          <AnimatePresence mode="popLayout">
            {sortedFlowers
              .filter((f) => f.z >= 10 && f.z < 25)
              .map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 210, damping: 22 }}
                  className="absolute"
                  style={{
                    left:      `${(250 + item.x) * scale}px`,
                    top:       `${(210 + item.y) * scale}px`,
                    transform: 'translate(-50%, -50%)',
                    zIndex:    item.z,
                  }}
                >
                  <img
                    src={`${base}/flowers/${item.flowerId}.webp`}
                    alt={item.flowerId}
                    width={getBouquetImgSize(item.flowerId) * item.scale * scale}
                    height={getBouquetImgSize(item.flowerId) * item.scale * scale}
                    className="pointer-events-none select-none"
                    style={{
                      transform: `rotate(${item.rotation}deg) scaleX(${item.flipped ? -1 : 1})`,
                    }}
                    draggable={false}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        <img
          src={`${base}/bush/bush-${bushline}-top.png`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{
            zIndex:    25,
            transform: `translateX(${-greeneryOffset * 0.5}%) translateY(-8%) scale(0.50)`,
            opacity:   0.40,
          }}
          draggable={false}
        />

        <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 40 }}>
          <AnimatePresence mode="popLayout">
            {sortedFlowers
              .filter((f) => f.z >= 25)
              .map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1,   y: 0  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  className="absolute"
                  style={{
                    left:      `${(250 + item.x) * scale}px`,
                    top:       `${(210 + item.y) * scale}px`,
                    transform: 'translate(-50%, -50%)',
                    zIndex:    item.z,
                  }}
                >
                  <img
                    src={`${base}/flowers/${item.flowerId}.webp`}
                    alt={item.flowerId}
                    width={getBouquetImgSize(item.flowerId) * item.scale * scale}
                    height={getBouquetImgSize(item.flowerId) * item.scale * scale}
                    className="pointer-events-none select-none"
                    style={{
                      transform: `rotate(${item.rotation}deg) scaleX(${item.flipped ? -1 : 1})`,
                    }}
                    draggable={false}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {wrap && <FrontWrap wrapId={wrap} scale={scale} />}
        {ribbon && <RibbonLayer color={ribbon.color} material={ribbon.material} scale={scale} />}

      </div>
    </div>
  );
}
