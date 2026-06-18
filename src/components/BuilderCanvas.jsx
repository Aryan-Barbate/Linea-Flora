import { useRef, useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_CENTER_X, CANVAS_CENTER_Y } from '../context/BouquetContext';
import { BackWrap, FrontWrap, RibbonLayer, StemsLayer } from './BouquetPreview';
import FlowerElement from './FlowerElement';

const CDN = {
  color: 'https://assets.pauwee.com/color',
  mono: 'https://assets.pauwee.com/mono',
};

const LONG_PRESS_MS = 500;
const LONG_PRESS_MOVE_THRESHOLD = 8;

function getDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function getAngleDeg(cx, cy, px, py) {
  return Math.atan2(py - cy, px - cx) * (180 / Math.PI);
}

export default function BuilderCanvas({
  placedFlowers,
  selectedId,
  onSelectFlower,
  onMoveFlower,
  onMoveComplete,
  dispatch,
  mode,
  greenery,
  wrap,
  ribbon,
  scale = 1,
  interactive = true,
}) {
  const canvasRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  const handleDrag = useRef({ active: false, type: null, itemId: null });
  const handleInitial = useRef(null);

  const longPressTimer = useRef(null);
  const longPressStart = useRef(null);

  const pinchState = useRef({ active: false, initialDist: null, initialScale: null, initialAngle: null, initialRotation: null });

  const base = CDN[mode] || CDN.color;
  const bushline = greenery + 1;

  const stemItems = placedFlowers.map((f) => ({
    id: f.id,
    x: f.x,
    y: f.y,
  }));

  const sortedFlowers = [...placedFlowers].sort((a, b) => a.z - b.z);

  const getCanvasCoords = useCallback((clientX, clientY) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const relX = (clientX - rect.left) / scale;
    const relY = (clientY - rect.top) / scale;
    return {
      x: relX - CANVAS_CENTER_X,
      y: relY - CANVAS_CENTER_Y,
    };
  }, [scale]);

  const handlePointerDown = useCallback((e, item) => {
    if (!interactive) return;
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget;
    if (target && target.setPointerCapture) {
      target.setPointerCapture(e.pointerId);
    }

    const coords = getCanvasCoords(e.clientX, e.clientY);
    dragOffset.current = {
      x: coords.x - item.x,
      y: coords.y - item.y,
    };

    setDraggingId(item.id);
    onSelectFlower(item.id);
  }, [interactive, getCanvasCoords, onSelectFlower]);

  const handleHandleStart = useCallback((e, item, handleType, corner) => {
    if (!interactive) return;
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget;
    if (target && target.setPointerCapture) {
      target.setPointerCapture(e.pointerId);
    }

    const coords = getCanvasCoords(e.clientX, e.clientY);
    handleDrag.current = {
      active: true,
      type: handleType,
      itemId: item.id,
      corner,
    };

    if (handleType === 'resize') {
      const imgSize = (() => {
        const FLOWERS_MAP = { small: 80, medium: 120, large: 160 };
        const f = { orchid: 'medium', tulip: 'medium', dahlia: 'small', anemone: 'medium', carnation: 'large', zinnia: 'medium', ranunculus: 'medium', sunflower: 'large', lily: 'large', daisy: 'small', peony: 'large', rose: 'medium' };
        return (FLOWERS_MAP[f[item.flowerId]] || 120) * item.scale * scale;
      })();
      const halfDiag = Math.sqrt(imgSize * imgSize + imgSize * imgSize) / 2;
      handleInitial.current = {
        distance: halfDiag,
        scale: item.scale,
        startX: coords.x,
        startY: coords.y,
        flowerX: item.x,
        flowerY: item.y,
      };
    } else if (handleType === 'rotate') {
      handleInitial.current = {
        angle: getAngleDeg(item.x, item.y, coords.x, coords.y),
        rotation: item.rotation,
      };
    }
  }, [interactive, getCanvasCoords, scale]);

  const handlePointerMove = useCallback((e) => {
    if (!draggingId && !handleDrag.current.active) return;
    e.preventDefault();

    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const coords = getCanvasCoords(e.clientX, e.clientY);

      if (handleDrag.current.active) {
        const hd = handleDrag.current;
        const hi = handleInitial.current;
        if (!hi) return;

        if (hd.type === 'resize') {
          const newDist = getDistance(coords.x, coords.y, hi.flowerX, hi.flowerY);
          const ratio = newDist / hi.distance;
          const newScale = Math.max(0.4, Math.min(2.5, hi.scale * ratio));
          dispatch({ type: 'SET_SCALE', id: hd.itemId, scale: newScale });
        } else if (hd.type === 'rotate') {
          const newAngle = getAngleDeg(hi.flowerX || 0, hi.flowerY || 0, coords.x, coords.y);
          const delta = newAngle - hi.angle;
          dispatch({ type: 'SET_ROTATION', id: hd.itemId, rotation: hi.rotation + delta });
        }
        return;
      }

      if (draggingId) {
        const newX = coords.x - dragOffset.current.x;
        const newY = coords.y - dragOffset.current.y;
        onMoveFlower(draggingId, newX, newY);
      }
    });
  }, [draggingId, getCanvasCoords, onMoveFlower, dispatch]);

  const handlePointerUp = useCallback((e) => {
    if (handleDrag.current.active) {
      handleDrag.current = { active: false, type: null, itemId: null, corner: null };
      handleInitial.current = null;
    }

    if (draggingId) {
      if (rafId.current) cancelAnimationFrame(rafId.current);

      const target = e.currentTarget;
      if (target && target.releasePointerCapture) {
        target.releasePointerCapture(e.pointerId);
      }

      setDraggingId(null);
      onMoveComplete(draggingId);
    }
  }, [draggingId, onMoveComplete]);

  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current || e.target.closest('[data-canvas-bg]')) {
      onSelectFlower(null);
    }
  }, [onSelectFlower]);

  const handleLongPressMove = useCallback((e) => {
    if (!longPressTimer.current) return;
    const touch = e.touches?.[0];
    if (!touch || !longPressStart.current) return;

    const dx = touch.clientX - longPressStart.current.x;
    const dy = touch.clientY - longPressStart.current.y;
    if (Math.sqrt(dx * dx + dy * dy) > LONG_PRESS_MOVE_THRESHOLD) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !interactive) return;

    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!target) return;

      const flowerEl = target.closest('[data-flower-id]');
      if (!flowerEl) return;

      const flowerId = flowerEl.getAttribute('data-flower-id');
      longPressStart.current = { x: touch.clientX, y: touch.clientY };
      longPressTimer.current = setTimeout(() => {
        onSelectFlower(flowerId);
        longPressTimer.current = null;
      }, LONG_PRESS_MS);
    };

    const handleTouchMove = (e) => {
      handleLongPressMove(e);

      if (e.touches.length === 2 && selectedId) {
        e.preventDefault();
        const dist = getDistance(
          e.touches[0].clientX, e.touches[0].clientY,
          e.touches[1].clientX, e.touches[1].clientY
        );
        const angle = getAngleDeg(
          e.touches[0].clientX, e.touches[0].clientY,
          e.touches[1].clientX, e.touches[1].clientY
        );
        const ps = pinchState.current;

        if (!ps.active) {
          ps.active = true;
          ps.initialDist = dist;
          ps.initialAngle = angle;
          const selected = placedFlowers.find((f) => f.id === selectedId);
          if (selected) {
            ps.initialScale = selected.scale;
            ps.initialRotation = selected.rotation;
          }
          return;
        }

        if (ps.initialDist && ps.initialScale !== undefined) {
          const newScale = ps.initialScale * (dist / ps.initialDist);
          dispatch({ type: 'SET_SCALE', id: selectedId, scale: newScale });
        }
        if (ps.initialAngle !== null && ps.initialRotation !== undefined) {
          const angleDelta = angle - ps.initialAngle;
          dispatch({ type: 'SET_ROTATION', id: selectedId, rotation: ps.initialRotation + angleDelta });
        }
      }
    };

    const handleTouchEnd = () => {
      handleLongPressEnd();
      pinchState.current = { active: false, initialDist: null, initialScale: null, initialAngle: null, initialRotation: null };
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [interactive, selectedId, placedFlowers, dispatch, onSelectFlower, handleLongPressMove, handleLongPressEnd]);

  const containerWidth = CANVAS_WIDTH * scale;
  const containerHeight = CANVAS_HEIGHT * scale;

  return (
    <div className="flex relative justify-center items-center py-4" style={{ minHeight: containerHeight + 60 }}>
      <div
        ref={canvasRef}
        className="relative"
        style={{ width: containerWidth, minHeight: containerHeight, touchAction: 'none' }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleCanvasClick}
      >
        {/* Bouquet guide area */}
        <div
          className="absolute pointer-events-none"
          data-canvas-bg
          style={{
            left: `${(CANVAS_CENTER_X - 150) * scale}px`,
            top: `${(CANVAS_CENTER_Y - 120) * scale}px`,
            width: `${300 * scale}px`,
            height: `${220 * scale}px`,
            border: '1px dashed rgba(0,0,0,0.08)',
            borderRadius: '50%',
          }}
        />

        <StemsLayer items={stemItems} scale={scale} />
        {wrap && <BackWrap wrapId={wrap} scale={scale} />}

        <img
          src={`${base}/bush/bush-${bushline}.png`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          data-canvas-bg
          style={{
            zIndex: 10,
            transform: 'translateY(-8%) scale(0.55)',
            opacity: 0.65,
          }}
          draggable={false}
        />

        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 14 }}>
          <AnimatePresence>
            {sortedFlowers
              .filter((f) => f.z < 10)
              .map((item) => (
                <FlowerElement
                  key={item.id}
                  item={item}
                  isSelected={selectedId === item.id}
                  isDragging={draggingId === item.id}
                  onPointerDown={(e) => handlePointerDown(e, item)}
                  onHandleStart={handleHandleStart}
                  scale={scale}
                  mode={mode}
                  dispatch={dispatch}
                />
              ))}
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 23 }}>
          <AnimatePresence>
            {sortedFlowers
              .filter((f) => f.z >= 10 && f.z < 25)
              .map((item) => (
                <FlowerElement
                  key={item.id}
                  item={item}
                  isSelected={selectedId === item.id}
                  isDragging={draggingId === item.id}
                  onPointerDown={(e) => handlePointerDown(e, item)}
                  onHandleStart={handleHandleStart}
                  scale={scale}
                  mode={mode}
                  dispatch={dispatch}
                />
              ))}
          </AnimatePresence>
        </div>

        <img
          src={`${base}/bush/bush-${bushline}-top.png`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          data-canvas-bg
          style={{
            zIndex: 25,
            transform: 'translateY(-8%) scale(0.50)',
            opacity: 0.40,
          }}
          draggable={false}
        />

        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 40 }}>
          <AnimatePresence>
            {sortedFlowers
              .filter((f) => f.z >= 25)
              .map((item) => (
                <FlowerElement
                  key={item.id}
                  item={item}
                  isSelected={selectedId === item.id}
                  isDragging={draggingId === item.id}
                  onPointerDown={(e) => handlePointerDown(e, item)}
                  onHandleStart={handleHandleStart}
                  scale={scale}
                  mode={mode}
                  dispatch={dispatch}
                />
              ))}
          </AnimatePresence>
        </div>

        {wrap && <FrontWrap wrapId={wrap} scale={scale} />}
        {ribbon && <RibbonLayer color={ribbon.color} material={ribbon.material} scale={scale} />}
      </div>
    </div>
  );
}
