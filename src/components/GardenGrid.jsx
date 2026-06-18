import { useMemo, useState } from 'react';
import { getBouquetImgSize } from '../context/BouquetContext';
import { BackWrap, FrontWrap, RibbonLayer, StemsLayer } from './BouquetPreview';

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
  { id: 16, flowers: ['sunflower', 'peony', 'daisy', 'rose', 'dahlia', 'zinnia', 'ranunculus'], mode: 'color', date: 'Feb 16, 2026', title: 'Summer Symphony', greenery: 1 },
  { id: 17, flowers: ['orchid', 'tulip', 'anemone', 'lily', 'carnation', 'rose'], mode: 'mono', date: 'Feb 17, 2026', title: 'Velvet Midnight', greenery: 2 },
  { id: 18, flowers: ['ranunculus', 'daisy', 'zinnia', 'carnation', 'tulip', 'orchid', 'rose'], mode: 'color', date: 'Feb 17, 2026', title: 'Sweet Nectar', greenery: 0 },
  { id: 19, flowers: ['peony', 'lily', 'dahlia', 'anemone', 'rose', 'daisy', 'sunflower'], mode: 'color', date: 'Feb 18, 2026', title: 'Golden Romance', greenery: 1 },
  { id: 20, flowers: ['carnation', 'orchid', 'tulip', 'zinnia', 'ranunculus', 'peony'], mode: 'mono', date: 'Feb 18, 2026', title: 'Classic Grace', greenery: 1 },
];

function createRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function scatterFlowers(flowerIds, seed) {
  const rng = createRng(seed);
  const n = flowerIds.length;
  let z = 1;
  return flowerIds.map((flowerId, i) => {
    const angle = (i / n) * Math.PI * 2 + (rng() - 0.5) * 0.8;
    const radius = 30 + rng() * 60;
    z += 1;
    return {
      id: `${flowerId}-${z}`,
      flowerId,
      x: Math.round(Math.cos(angle) * radius * 10) / 10,
      y: Math.round(Math.sin(angle) * radius * 0.7 * 10) / 10 - 10,
      rotation: Math.round((rng() - 0.5) * 30 * 10) / 10,
      scale: 0.85 + rng() * 0.3,
      z,
      flipped: rng() > 0.8,
    };
  });
}

function BouquetThumbnail({ flowers, mode, greenery, seed }) {
  const base = CDN[mode] || CDN.color;
  const bushline = greenery + 1;

  const WRAP_IDS = ['ivory', 'dusty-rose', 'charcoal', 'kraft', 'powder-blue', 'lavender'];
  const RIBBON_COLORS_LIST = ['white', 'gold', 'silver', 'pink', 'red', 'lavender', 'navy'];

  const mockWrap = WRAP_IDS[seed % WRAP_IDS.length];
  const mockRibbonColor = RIBBON_COLORS_LIST[(seed * 3) % RIBBON_COLORS_LIST.length];
  const mockRibbonMaterial = 'satin';

  const { placedFlowers, greeneryOffset } = useMemo(() => {
    const items = scatterFlowers(flowers, seed);
    const rng = createRng(seed * 73 + 29);
    const greeneryX = ((rng() - 0.5) * 6);
    return { placedFlowers: items, greeneryOffset: greeneryX };
  }, [flowers, seed]);

  const sortedFlowers = useMemo(() =>
    [...placedFlowers].sort((a, b) => a.z - b.z),
    [placedFlowers]
  );

  const stemItems = useMemo(() =>
    placedFlowers.map((f) => ({ id: f.id, x: f.x, y: f.y })),
    [placedFlowers]
  );

  return (
    <div className="relative" style={{ width: '500px', height: '410px' }}>
      <StemsLayer items={stemItems} scale={1} />

      {mockWrap && <BackWrap wrapId={mockWrap} scale={1} />}

      <img
        src={`${base}/bush/bush-${bushline}.png`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{
          zIndex: 10,
          transform: `translateX(${greeneryOffset}%) translateY(-8%) scale(0.55)`,
          opacity: 0.65,
        }}
        draggable={false}
      />

      <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 14 }}>
        {sortedFlowers
          .filter((f) => f.z < 15)
          .map((item) => (
            <div
              key={`${item.id}-back`}
              className="absolute"
              style={{
                left: `${250 + item.x}px`,
                top: `${210 + item.y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: item.z,
              }}
            >
              <img
                src={`${base}/flowers/${item.flowerId}.webp`}
                alt={item.flowerId}
                width={getBouquetImgSize(item.flowerId) * item.scale}
                height={getBouquetImgSize(item.flowerId) * item.scale}
                className="pointer-events-none select-none"
                style={{ transform: `rotate(${item.rotation}deg) scaleX(${item.flipped ? -1 : 1})`, filter: 'brightness(0.93)' }}
                draggable={false}
              />
            </div>
          ))}
      </div>

      <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 23 }}>
        {sortedFlowers
          .filter((f) => f.z >= 15 && f.z < 30)
          .map((item) => (
            <div
              key={`${item.id}-mid`}
              className="absolute"
              style={{
                left: `${250 + item.x}px`,
                top: `${210 + item.y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: item.z,
              }}
            >
              <img
                src={`${base}/flowers/${item.flowerId}.webp`}
                alt={item.flowerId}
                width={getBouquetImgSize(item.flowerId) * item.scale}
                height={getBouquetImgSize(item.flowerId) * item.scale}
                className="pointer-events-none select-none"
                style={{ transform: `rotate(${item.rotation}deg) scaleX(${item.flipped ? -1 : 1})` }}
                draggable={false}
              />
            </div>
          ))}
      </div>

      <img
        src={`${base}/bush/bush-${bushline}-top.png`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{
          zIndex: 25,
          transform: `translateX(${-greeneryOffset * 0.5}%) translateY(-8%) scale(0.50)`,
          opacity: 0.40,
        }}
        draggable={false}
      />

      <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: 40 }}>
        {sortedFlowers
          .filter((f) => f.z >= 30)
          .map((item) => (
            <div
              key={`${item.id}-front`}
              className="absolute"
              style={{
                left: `${250 + item.x}px`,
                top: `${210 + item.y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: item.z,
              }}
            >
              <img
                src={`${base}/flowers/${item.flowerId}.webp`}
                alt={item.flowerId}
                width={getBouquetImgSize(item.flowerId) * item.scale}
                height={getBouquetImgSize(item.flowerId) * item.scale}
                className="pointer-events-none select-none"
                style={{ transform: `rotate(${item.rotation}deg) scaleX(${item.flipped ? -1 : 1})` }}
                draggable={false}
              />
            </div>
          ))}
      </div>

      {mockWrap && <FrontWrap wrapId={mockWrap} scale={1} />}
      {mockWrap && (
        <RibbonLayer
          color={mockRibbonColor}
          material={mockRibbonMaterial}
          scale={1}
        />
      )}
    </div>
  );
}

function GardenCard({ bouquet }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group cursor-pointer"
    >
      <div
        className={`bg-white border overflow-hidden transition-all duration-300 ${
          hovered
            ? 'border-black/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]'
            : 'border-black/5 shadow-none'
        }`}
      >
        <div className="relative overflow-hidden flex justify-center items-center bg-cream/50" style={{ minHeight: '200px' }}>
          <div
            className="transition-transform duration-300 ease-out"
            style={{ transform: `scale(${hovered ? 0.44 : 0.42})`, transformOrigin: 'center center' }}
          >
            <BouquetThumbnail
              flowers={bouquet.flowers}
              mode={bouquet.mode}
              greenery={bouquet.greenery}
              seed={bouquet.id}
            />
          </div>
        </div>

        <div className="px-4 pb-4 pt-3 border-t border-black/5">
          <h3 className="font-mono text-xs uppercase tracking-widest mb-1">{bouquet.title}</h3>
          <p className="font-mono text-[10px] text-black/40 mb-2">{bouquet.date}</p>
          <p
            className={`font-mono text-[10px] uppercase tracking-widest text-black/50 transition-all duration-200 ${
              hovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'
            }`}
          >
            View Bouquet →
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GardenGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 p-4 sm:p-6 w-full max-w-7xl mx-auto">
      {MOCK_BOUQUETS.map((b) => (
        <GardenCard key={b.id} bouquet={b} />
      ))}
    </div>
  );
}
