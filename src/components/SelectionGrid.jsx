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
  const { flowers, addFlower, removeFlower, mode } = useBouquet();
  const base = CDN[mode] || CDN.color;

  return (
    <Tooltip.Provider delayDuration={0} disableHoverableContent>
      <div className="flex flex-wrap justify-center gap-4 mb-8 items-center min-h-[200px]">
        {FLOWERS.map((flower) => {
          const isSelected = flowers.includes(flower.id);
          return (
            <FlowerTooltip key={flower.id} flower={flower}>
              <motion.button
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  if (isSelected) {
                    removeFlower(flower.id);
                  } else {
                    addFlower(flower.id);
                  }
                }}
                className="flex relative flex-col items-center cursor-pointer"
              >
                <div
                  className={`
                    ${getGridSize(flower.id)} flex items-center justify-center
                    transition-transform duration-300 overflow-hidden
                    ${isSelected ? 'transform -translate-y-2 ring-2 ring-black ring-offset-2' : ''}
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
                      className="object-cover"
                      loading="eager"
                      draggable={false}
                    />
                  </picture>
                </div>
                {isSelected && (
                  <div className="flex absolute top-0 right-0 justify-center items-center w-5 h-5 text-xs rounded-full bg-black text-white sm:w-6 sm:h-6 font-mono">
                    ✓
                  </div>
                )}
              </motion.button>
            </FlowerTooltip>
          );
        })}
      </div>

      {flowers.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm opacity-50 font-mono text-center">Click a selected flower to deselect it.</p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {flowers.map((id) => {
              const flower = FLOWERS.find((x) => x.id === id);
              if (!flower) return null;
              return (
                <div
                  key={id}
                  onClick={() => removeFlower(id)}
                  className="px-3 py-1 font-mono text-xs rounded-full border transition-colors cursor-pointer border-black/30 text-black hover:bg-black hover:text-white"
                >
                  {flower.name.toUpperCase()}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Tooltip.Provider>
  );
}
