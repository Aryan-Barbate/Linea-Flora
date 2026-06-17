import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getBouquetImgSize } from '../context/BouquetContext';

const CDN = {
  color: 'https://assets.pauwee.com/color',
  mono: 'https://assets.pauwee.com/mono',
};

const ALL_FLOWERS = [
  'orchid', 'tulip', 'dahlia', 'anemone', 'carnation',
  'zinnia', 'ranunculus', 'sunflower', 'lily', 'daisy', 'peony', 'rose',
];

const MOCK_BOUQUETS = [
  { id: 1, flowers: ['rose', 'peony', 'daisy', 'lily', 'orchid', 'anemone'], mode: 'color', date: '2/15/2026', greenery: 1 },
  { id: 2, flowers: ['sunflower', 'zinnia', 'daisy', 'carnation', 'anemone', 'tulip'], mode: 'color', date: '2/14/2026', greenery: 0 },
  { id: 3, flowers: ['orchid', 'lily', 'anemone', 'ranunculus', 'peony', 'carnation'], mode: 'mono', date: '2/12/2026', greenery: 2 },
  { id: 4, flowers: ['daisy', 'sunflower', 'tulip', 'peony', 'zinnia', 'lily'], mode: 'color', date: '2/10/2026', greenery: 1 },
  { id: 5, flowers: ['carnation', 'ranunculus', 'orchid', 'anemone', 'daisy', 'peony'], mode: 'color', date: '2/8/2026', greenery: 0 },
  { id: 6, flowers: ['rose', 'lily', 'sunflower', 'daisy', 'carnation', 'zinnia'], mode: 'mono', date: '2/5/2026', greenery: 1 },
  { id: 7, flowers: ['anemone', 'orchid', 'peony', 'ranunculus', 'lily', 'rose'], mode: 'color', date: '2/3/2026', greenery: 2 },
  { id: 8, flowers: ['zinnia', 'sunflower', 'daisy', 'carnation', 'orchid', 'anemone'], mode: 'color', date: '2/1/2026', greenery: 0 },
  { id: 9, flowers: ['peony', 'rose', 'lily', 'daisy', 'ranunculus', 'zinnia'], mode: 'mono', date: '1/28/2026', greenery: 1 },
  { id: 10, flowers: ['orchid', 'anemone', 'carnation', 'sunflower', 'peony', 'lily'], mode: 'color', date: '1/25/2026', greenery: 2 },
  { id: 11, flowers: ['daisy', 'tulip', 'zinnia', 'ranunculus', 'orchid', 'carnation'], mode: 'color', date: '1/22/2026', greenery: 1 },
  { id: 12, flowers: ['lily', 'sunflower', 'anemone', 'peony', 'daisy', 'rose'], mode: 'mono', date: '1/20/2026', greenery: 0 },
];

function BouquetThumbnail({ flowers, mode, greenery }) {
  const base = CDN[mode] || CDN.color;
  const bushline = greenery + 1;

  const items = useMemo(() => {
    return flowers.map((id) => {
      const size = getBouquetImgSize(id);
      const rot = Math.random() * 10 - 5;
      return { id, size, rot };
    });
  }, [flowers]);

  return (
    <div className="flex relative justify-center items-center w-full" style={{ aspectRatio: '500/410' }}>
      <img
        src={`${base}/bush/bush-${bushline}.png`}
        alt=""
        width={500}
        height={410}
        className="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none select-none"
        draggable={false}
      />
      <div className="flex flex-wrap-reverse justify-center items-center -space-x-2 -space-y-10 relative z-[1] w-[60%]">
        {items.map((item, i) => (
          <div key={`${item.id}-${i}`} className="flex justify-center items-center pt-1" style={{ order: i }}>
            <img
              src={`${base}/flowers/${item.id}.webp`}
              alt={item.id}
              width={Math.round(item.size * 0.5)}
              height={Math.round(item.size * 0.5)}
              className="relative z-10 pointer-events-none select-none"
              style={{ transform: `rotate(${item.rot}deg)` }}
              draggable={false}
            />
          </div>
        ))}
      </div>
      <img
        src={`${base}/bush/bush-${bushline}-top.png`}
        alt=""
        width={500}
        height={410}
        className="absolute inset-0 w-full h-full object-contain z-[2] pointer-events-none select-none"
        draggable={false}
      />
    </div>
  );
}

export default function GardenGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6 max-w-5xl mx-auto">
      {MOCK_BOUQUETS.map((b) => (
        <motion.div
          key={b.id}
          whileHover={{ scale: 1.02 }}
          className="border border-black bg-white flex flex-col text-center"
        >
          <BouquetThumbnail flowers={b.flowers} mode={b.mode} greenery={b.greenery} />
          <p className="text-sm text-gray-500 font-mono m-4">{b.date}</p>
        </motion.div>
      ))}
    </div>
  );
}
