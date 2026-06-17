import { motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { FLOWERS, getGridSize, getGridSizePx, useBouquet } from '../context/BouquetContext';

const CDN = {
  color: 'https://assets.pauwee.com/color/flowers',
  mono: 'https://assets.pauwee.com/mono/flowers',
};

function FlowerTooltip({ children, flower }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={8}
          className="z-10 p-2 w-40 text-center sm:w-48 bg-[#F9F9EE] rounded border shadow-lg border-black/20"
        >
          <h3 className="font-mono text-sm font-bold uppercase">{flower.name}</h3>
          <p className="font-mono text-xs">{flower.meaning}</p>
          <p className="font-mono text-xs">Birth Month: {flower.birthMonth}</p>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export default function SelectionGrid() {
  const { selectedFlowers, toggleFlower, mode } = useBouquet();
  const base = CDN[mode] || CDN.color;

  return (
    <Tooltip.Provider delayDuration={0} disableHoverableContent>
      <div className="flex flex-wrap justify-center gap-4 mb-8 items-center min-h-[200px]">
        {FLOWERS.map((flower) => {
          const isSelected = selectedFlowers.includes(flower.id);
          return (
            <FlowerTooltip key={flower.id} flower={flower}>
              <motion.button
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.95 }}
                animate={isSelected ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={(e) => {
                  e.preventDefault();
                  toggleFlower(flower.id);
                }}
                className="flex relative flex-col items-center cursor-pointer"
              >
                <div
                  className={`
                    ${getGridSize(flower.id)} flex items-center justify-center
                    transition-transform duration-300 overflow-hidden
                    ${isSelected ? 'transform -translate-y-2' : ''}
                    hover:transform hover:-translate-y-2
                  `}
                >
                  <picture>
                    <source srcSet={`${base}/${flower.id}.webp`} type="image/webp" />
                    <img
                      src={`${base}/${flower.id}.webp`}
                      alt={flower.name}
                      width={getGridSizePx(flower.id)}
                      height={getGridSizePx(flower.id)}
                      className={`object-cover ${isSelected ? 'opacity-90' : ''}`}
                      loading="eager"
                      draggable={false}
                    />
                  </picture>
                </div>
                {isSelected && (
                  <div className="absolute top-0 right-0 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </motion.button>
            </FlowerTooltip>
          );
        })}
      </div>
    </Tooltip.Provider>
  );
}
