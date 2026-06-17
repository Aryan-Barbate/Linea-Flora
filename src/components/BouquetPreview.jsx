import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FLOWERS, getBouquetImgSize } from '../context/BouquetContext';

const CDN = {
  color: 'https://assets.pauwee.com/color',
  mono: 'https://assets.pauwee.com/mono',
};

function shuffleArray(arr, seed) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = (seed * (i + 1) * 2654435761 + i) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function BouquetPreview({ selectedFlowers, mode, greenery, arrangementSeed }) {
  const base = CDN[mode] || CDN.color;
  const bushline = greenery + 1;

  const items = useMemo(() => {
    return shuffleArray(selectedFlowers, arrangementSeed + 1).map((id) => {
      const size = getBouquetImgSize(id);
      const rot = Math.random() * 10 - 5;
      return { id, size, rot };
    });
  }, [selectedFlowers, arrangementSeed]);

  return (
    <div className="flex relative justify-center items-center py-4 my-16">
      <div className="relative w-[500px] min-h-[410px]">
        <img
          src={`${base}/bush/bush-${bushline}.png`}
          alt=""
          width={600}
          height={500}
          className="absolute top-1/2 left-1/2 z-0 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          draggable={false}
        />

        <div className="flex flex-wrap-reverse w-[300px] justify-center items-center -space-x-4 -space-y-20 relative m-auto">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <motion.div
                key={`${item.id}-${arrangementSeed}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                className="flex relative justify-center items-center pt-4"
                style={{ order: i }}
              >
                <img
                  src={`${base}/flowers/${item.id}.webp`}
                  alt={item.id}
                  width={item.size}
                  height={item.size}
                  className="relative z-10 pointer-events-none select-none"
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
          width={600}
          height={500}
          className="absolute top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
