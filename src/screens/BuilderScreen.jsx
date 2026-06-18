import { useReducer, useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useBouquet, FLOWERS } from '../context/BouquetContext';
import { builderReducer } from '../utils/builderReducer';
import BuilderCanvas from '../components/BuilderCanvas';
import StepHeader from '../components/StepHeader';

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
          className="z-[10001] p-2 w-40 text-center sm:w-48 bg-[#F9F9EE] rounded border shadow-lg border-black/20 font-mono"
        >
          <h3 className="text-sm font-bold uppercase">{flower.name}</h3>
          <p className="text-xs">{flower.meaning}</p>
          <p className="text-xs">Birth Month: {flower.birthMonth}</p>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export default function BuilderScreen() {
  const { mode, setMode, greenery, setGreenery, placedFlowers, setPlacedFlowers, setStep, wrap, ribbon } = useBouquet();
  const [state, dispatch] = useReducer(builderReducer, placedFlowers);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState(null);
  const [canvasScale, setCanvasScale] = useState(1);

  const catalogRef = useRef(null);
  const placedIds = state.map((f) => f.flowerId);
  const localCanProceed = state.length >= 6 && state.length <= 10;

  useEffect(() => {
    const catalog = catalogRef.current;
    if (!catalog) return;

    const handleWheelScroll = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        catalog.scrollLeft += e.deltaY;
      }
    };

    catalog.addEventListener('wheel', handleWheelScroll, { passive: false });
    return () => {
      catalog.removeEventListener('wheel', handleWheelScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        // Mobile layout: scale canvas based on viewport width
        const s = Math.max(0.55, Math.min(0.9, (w - 32) / 500));
        setCanvasScale(s);
      } else if (w < 1024) {
        // Tablet layout
        const s = Math.max(0.7, Math.min(1.0, (w - 64) / 500));
        setCanvasScale(s);
      } else {
        // Desktop layout (leaves space for sidebar controls)
        setCanvasScale(0.85);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddFlower = useCallback((flowerId) => {
    if (state.length >= 10) {
      setToast('Maximum 10 flowers!');
      setTimeout(() => setToast(null), 1800);
      return;
    }
    dispatch({ type: 'ADD_FLOWER', flowerId });
  }, [state.length]);

  const handleMoveFlower = useCallback((id, x, y) => {
    dispatch({ type: 'MOVE_FLOWER', id, x, y });
  }, []);

  const handleMoveComplete = useCallback(() => {
  }, []);

  const handleSelectFlower = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const handleProceed = () => {
    if (!localCanProceed) {
      setToast('You need at least 6 flowers! Add more from the catalog.');
      setTimeout(() => setToast(null), 2000);
      return;
    }
    setPlacedFlowers(state);
    setStep(2);
  };

  const handleBack = () => {
    setPlacedFlowers(state);
    setStep(0);
  };

  const selectedFlower = selectedId ? state.find((f) => f.id === selectedId) : null;

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-4 min-h-screen justify-between md:justify-start bg-cream">
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[10002] rounded-full bg-[#F9F9EE] text-black text-xs px-6 py-3 shadow-md border border-black text-center w-[85vw] max-w-sm font-mono">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="w-full flex-none">
        <StepHeader />
      </div>

      {/* Main Grid: Responsive stacked on mobile, side-by-side on desktop */}
      <div className="flex-1 flex flex-col justify-center w-full max-w-screen-xl mx-auto my-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full">
          
          {/* Left Column: Canvas and Nav */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center w-full">
              <BuilderCanvas
                placedFlowers={state}
                selectedId={selectedId}
                onSelectFlower={handleSelectFlower}
                onMoveFlower={handleMoveFlower}
                onMoveComplete={handleMoveComplete}
                dispatch={dispatch}
                mode={mode}
                greenery={greenery}
                wrap={wrap}
                ribbon={ribbon}
                scale={canvasScale}
              />
            </div>

            {/* Navigation (aligned with Canvas) */}
            <div className="flex flex-row gap-4 justify-center mt-2 w-full">
              <button
                onClick={handleBack}
                className="text-xs sm:text-sm px-6 py-2 font-mono uppercase tracking-widest border border-black hover:bg-black/5 transition-colors duration-150"
              >
                BACK
              </button>
              <button
                onClick={handleProceed}
                className={`text-xs sm:text-sm px-6 py-2 font-mono uppercase tracking-widest transition-colors duration-150 ${
                  localCanProceed ? 'bg-[#000000] text-beige hover:bg-black/90' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                NEXT
              </button>
            </div>
          </div>

          {/* Right Column: Catalog & Styling Controls */}
          <div className="lg:col-span-5 flex flex-col justify-center w-full bg-[#fcfcfa] border border-black/10 p-4 sm:p-5 rounded-md shadow-sm">
            
            {/* Flower Catalog */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-mono text-xs tracking-[0.15em] uppercase font-bold text-black/70">Pick Flowers</h2>
                <span className="font-mono text-[10px] sm:text-xs text-black/40">{state.length}/10 placed</span>
              </div>
              
              <Tooltip.Provider delayDuration={0} disableHoverableContent>
                <div 
                  ref={catalogRef}
                  className="flex overflow-x-auto gap-3 py-2 px-1 select-none w-full scroll-smooth"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  {FLOWERS.map((flower) => {
                    const isPlaced = placedIds.includes(flower.id);
                    return (
                      <FlowerTooltip key={flower.id} flower={flower}>
                        <motion.button
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddFlower(flower.id);
                          }}
                          className="flex-none relative flex flex-col items-center cursor-pointer"
                        >
                          <div
                            className={`
                              w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-white border border-black/10 flex items-center justify-center
                              transition-all duration-300 overflow-hidden
                              ${isPlaced ? 'opacity-40 border-black/5 bg-black/5' : 'hover:border-black/30'}
                            `}
                          >
                            <picture>
                              <source srcSet={`${CDN[mode] || CDN.color}/${flower.id}.webp`} type="image/webp" />
                              <img
                                src={`${CDN[mode] || CDN.color}/${flower.id}.webp`}
                                alt={flower.name}
                                width={54}
                                height={54}
                                className="object-cover pointer-events-none select-none w-full h-full"
                                loading="eager"
                                draggable={false}
                              />
                            </picture>
                          </div>
                          {isPlaced && (
                            <div className="flex absolute -top-1 -right-1 justify-center items-center w-4 h-4 text-[9px] rounded-full bg-black text-white font-mono">
                              ✓
                            </div>
                          )}
                        </motion.button>
                      </FlowerTooltip>
                    );
                  })}
                </div>
              </Tooltip.Provider>
            </div>

            {/* Styling & Layers Controls */}
            <div className="flex flex-col gap-4 pt-3 border-t border-black/5">
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <button
                  onClick={() => setMode(mode === 'color' ? 'mono' : 'color')}
                  className={`px-3 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-colors duration-150 border ${
                    mode === 'color'
                      ? 'bg-black text-beige border-black font-bold'
                      : 'bg-transparent text-black border-black/30 hover:border-black'
                  }`}
                >
                  {mode === 'color' ? 'Color' : 'B&W'}
                </button>
                <button
                  onClick={() => setGreenery((greenery + 1) % 3)}
                  className="px-3 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-black border border-black/30 hover:border-black transition-colors duration-150 bg-white"
                >
                  Greenery {greenery + 1}
                </button>
                {selectedFlower && (
                  <>
                    <button
                      onClick={() => dispatch({ type: 'BRING_FORWARD', id: selectedId })}
                      className="px-2.5 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-black border border-black/30 hover:border-black transition-colors duration-150 bg-white"
                    >
                      ↑ Forward
                    </button>
                    <button
                      onClick={() => dispatch({ type: 'SEND_BACKWARD', id: selectedId })}
                      className="px-2.5 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-black border border-black/30 hover:border-black transition-colors duration-150 bg-white"
                    >
                      ↓ Backward
                    </button>
                  </>
                )}
                {state.length > 0 && (
                  <button
                    onClick={() => { dispatch({ type: 'CLEAR_ALL' }); setSelectedId(null); }}
                    className="px-3 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-red-600 border border-red-300 hover:bg-red-50 transition-colors duration-150 bg-white"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="min-h-[20px] flex items-center justify-center lg:justify-start">
                {selectedId ? (
                  <p className="font-mono text-[9px] sm:text-[10px] text-black/40 tracking-wider uppercase">
                    Drag handles to resize/rotate · Tap bg to deselect
                  </p>
                ) : (
                  <p className="font-mono text-[9px] sm:text-[10px] text-black/30 tracking-wider uppercase">
                    Select a flower on the canvas to edit layer or size
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
