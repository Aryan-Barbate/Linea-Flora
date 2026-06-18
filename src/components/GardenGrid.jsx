import { useMemo } from 'react';
import { arrangeBouquet } from '../utils/bouquetArranger';

const CDN = {
  color: 'https://assets.pauwee.com/color',
  mono: 'https://assets.pauwee.com/mono',
};

const MOCK_BOUQUETS = [
  { id: 1, flowers: ['rose', 'peony', 'daisy', 'lily', 'orchid', 'anemone'], mode: 'color', date: 'Feb 15, 2026', title: 'Rose & Peony Dream', greenery: 1 },
  { id: 2, flowers: ['sunflower', 'lily', 'rose', 'orchid', 'carnation', 'ranunculus', 'daisy'], mode: 'color', date: 'Feb 15, 2026', title: 'Sunlit Garden', greenery: 0 },
  { id: 3, flowers: ['carnation', 'lily', 'orchid', 'rose', 'peony', 'zinnia', 'tulip'], mode: 'color', date: 'Feb 15, 2026', title: 'Spring Carnival', greenery: 1 },
  { id: 4, flowers: ['zinnia', 'carnation', 'peony', 'ranunculus', 'rose', 'tulip'], mode: 'color', date: 'Feb 15, 2026', title: 'Zinnia Sunrise', greenery: 2 },
  { id: 5, flowers: ['anemone', 'daisy', 'orchid', 'tulip', 'rose', 'peony', 'ranunculus', 'zinnia'], mode: 'color', date: 'Feb 15, 2026', title: 'Anemone Waltz', greenery: 1 },
  { id: 6, flowers: ['rose', 'daisy', 'orchid', 'tulip', 'anemone', 'peony', 'carnation', 'lily', 'sunflower'], mode: 'color', date: 'Feb 15, 2026', title: 'Meadow Cascade', greenery: 1 },
  { id: 7, flowers: ['rose', 'peony', 'dahlia', 'orchid', 'zinnia', 'ranunculus'], mode: 'color', date: 'Feb 15, 2026', title: 'Dahlia Blush', greenery: 2 },
  { id: 8, flowers: ['lily', 'orchid', 'daisy', 'sunflower', 'rose', 'carnation'], mode: 'color', date: 'Feb 15, 2026', title: 'Orchid Sunrise', greenery: 2 },
  { id: 9, flowers: ['tulip', 'sunflower', 'rose', 'peony', 'daisy', 'anemone', 'ranunculus', 'zinnia', 'orchid'], mode: 'color', date: 'Feb 15, 2026', title: 'Tulip Sunburst', greenery: 2 },
  { id: 10, flowers: ['sunflower', 'lily', 'carnation', 'rose', 'peony', 'orchid', 'tulip', 'daisy', 'dahlia', 'anemone'], mode: 'color', date: 'Feb 15, 2026', title: 'Full Bloom', greenery: 1 },
  { id: 11, flowers: ['lily', 'orchid', 'daisy', 'ranunculus', 'zinnia', 'peony', 'rose', 'carnation', 'sunflower', 'tulip'], mode: 'color', date: 'Feb 15, 2026', title: 'Garden Party', greenery: 2 },
  { id: 12, flowers: ['rose', 'carnation', 'peony', 'orchid', 'lily', 'daisy', 'zinnia', 'ranunculus'], mode: 'color', date: 'Feb 15, 2026', title: 'Petal Harmony', greenery: 0 },
  { id: 13, flowers: ['lily', 'orchid', 'daisy', 'ranunculus', 'peony', 'rose', 'anemone', 'tulip'], mode: 'mono', date: 'Feb 15, 2026', title: 'Moonlit Bloom', greenery: 1 },
  { id: 14, flowers: ['sunflower', 'lily', 'rose', 'daisy', 'anemone', 'orchid', 'peony', 'carnation', 'zinnia', 'tulip'], mode: 'color', date: 'Feb 15, 2026', title: 'Wildflower Mix', greenery: 2 },
  { id: 15, flowers: ['orchid', 'daisy', 'ranunculus', 'zinnia', 'peony', 'rose', 'tulip', 'anemone', 'dahlia', 'carnation'], mode: 'mono', date: 'Feb 15, 2026', title: 'Silver Elegance', greenery: 1 },
];

function createRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function BouquetThumbnail({ flowers, mode, greenery, seed }) {
  const base = CDN[mode] || CDN.color;
  const bushline = greenery + 1;

  const { backItems, frontItems, greeneryOffset } = useMemo(() => {
    const items = arrangeBouquet(flowers, seed, 0.65);
    const rng = createRng(seed * 73 + 29);
    const greeneryX = ((rng() - 0.5) * 6);
    return {
      backItems: items.filter((item) => item.z < 30),
      frontItems: items.filter((item) => item.z >= 30),
      greeneryOffset: greeneryX,
    };
  }, [flowers, seed]);

  return (
    <div className="flex relative justify-center items-center w-full p-2" style={{ aspectRatio: '500/410' }}>
      <img
        src={`${base}/bush/bush-${bushline}.png`}
        alt=""
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        style={{
          zIndex: 0,
          transform: `translateX(${greeneryOffset}%) scale(0.75)`,
          opacity: 0.85,
        }}
        draggable={false}
      />

      <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 10 }}>
        {backItems.map((item) => (
          <div
            key={`${item.id}-${seed}`}
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
              className="pointer-events-none select-none"
              style={{ width: item.size, height: item.size, transform: `rotate(${item.rot}deg)` }}
              draggable={false}
            />
          </div>
        ))}
      </div>

      <img
        src={`${base}/bush/bush-${bushline}-top.png`}
        alt=""
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        style={{
          zIndex: 25,
          transform: `translateX(${-greeneryOffset * 0.5}%) scale(0.75)`,
          opacity: 0.7,
        }}
        draggable={false}
      />

      <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 35 }}>
        {frontItems.map((item) => (
          <div
            key={`${item.id}-${seed}`}
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
              className="pointer-events-none select-none"
              style={{ width: item.size, height: item.size, transform: `rotate(${item.rot}deg)` }}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GardenGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {MOCK_BOUQUETS.map((b) => (
        <div key={b.id}>
          <div className="text-center">
            <div className="flex items-center justify-center relative py-4 my-4">
              <div className="relative w-[500px] min-h-[410px]">
                <BouquetThumbnail flowers={b.flowers} mode={b.mode} greenery={b.greenery} seed={b.id} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
