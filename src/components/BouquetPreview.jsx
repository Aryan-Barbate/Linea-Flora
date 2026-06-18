import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { arrangeBouquet } from '../utils/bouquetArranger';

const CDN = {
  color: 'https://assets.pauwee.com/color',
  mono: 'https://assets.pauwee.com/mono',
};

function createRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export default function BouquetPreview({ flowers, mode, greenery, arrangementSeed }) {
  const base = CDN[mode] || CDN.color;
  const bushline = greenery + 1;

  const { backItems, frontItems, greeneryOffset } = useMemo(() => {
    const items = arrangeBouquet(flowers, arrangementSeed, 0.95);
    const rng = createRng(arrangementSeed * 73 + 29);
    const greeneryX = ((rng() - 0.5) * 6);
    return {
      backItems: items.filter((item) => item.z < 30),
      frontItems: items.filter((item) => item.z >= 30),
      greeneryOffset: greeneryX,
    };
  }, [flowers, arrangementSeed]);

  return (
    <div className="flex relative justify-center items-center py-4 my-16">
      <div className="relative w-[500px] min-h-[410px] overflow-visible">
        <img
          src={`${base}/bush/bush-${bushline}.png`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{
            zIndex: 0,
            transform: `translateX(${greeneryOffset}%) scale(0.75)`,
            opacity: 0.85,
          }}
          draggable={false}
        />

        <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 10 }}>
          <AnimatePresence mode="popLayout">
            {backItems.map((item) => (
              <motion.div
                key={`${item.id}-${arrangementSeed}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                className="absolute"
                style={{
                  left: `calc(50% + ${item.x}%)`,
                  top: `calc(50% + ${item.y}%)`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: item.z,
                }}
              >
                <img
                  src={`${base}/flowers/${item.id}.webp`}
                  alt={item.id}
                  width={item.size}
                  height={item.size}
                  className="pointer-events-none select-none"
                  style={{ transform: `rotate(${item.rot}deg)` }}
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
            zIndex: 25,
            transform: `translateX(${-greeneryOffset * 0.5}%) scale(0.75)`,
            opacity: 0.7,
          }}
          draggable={false}
        />

        <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 35 }}>
          <AnimatePresence mode="popLayout">
            {frontItems.map((item) => (
              <motion.div
                key={`${item.id}-${arrangementSeed}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                className="absolute"
                style={{
                  left: `calc(50% + ${item.x}%)`,
                  top: `calc(50% + ${item.y}%)`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: item.z,
                }}
              >
                <img
                  src={`${base}/flowers/${item.id}.webp`}
                  alt={item.id}
                  width={item.size}
                  height={item.size}
                  className="pointer-events-none select-none"
                  style={{ transform: `rotate(${item.rot}deg)` }}
                  draggable={false}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
