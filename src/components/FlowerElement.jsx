import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { getBouquetImgSize } from '../context/BouquetContext';

const CDN = {
  color: 'https://assets.pauwee.com/color',
  mono: 'https://assets.pauwee.com/mono',
};

export default function FlowerElement({ item, isSelected, isDragging, onPointerDown, onHandleStart, scale, mode, dispatch }) {
  const base = CDN[mode] || CDN.color;
  const imgSize = getBouquetImgSize(item.flowerId);
  const finalSize = imgSize * item.scale * scale;
  const halfSize = finalSize / 2;
  const handleSize = 10;
  const rotateHandleOffset = 24;

  const handleResizePointerDown = useCallback((e, corner) => {
    e.preventDefault();
    e.stopPropagation();
    if (onHandleStart) onHandleStart(e, item, 'resize', corner);
  }, [item, onHandleStart]);

  const handleRotatePointerDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onHandleStart) onHandleStart(e, item, 'rotate');
  }, [item, onHandleStart]);

  const handleDelete = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'DELETE_FLOWER', id: item.id });
  }, [item.id, dispatch]);

  const handleDuplicate = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'DUPLICATE_FLOWER', id: item.id });
  }, [item.id, dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: isDragging ? 1.05 : 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: isDragging ? 400 : 220, damping: isDragging ? 30 : 22 }}
      className="absolute pointer-events-auto"
      data-flower-id={item.id}
      style={{
        left: `${(250 + item.x) * scale}px`,
        top: `${(210 + item.y) * scale}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: item.z,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
      onPointerDown={onPointerDown}
    >
      {/* Flower image */}
      <img
        src={`${base}/flowers/${item.flowerId}.webp`}
        alt={item.flowerId}
        width={finalSize}
        height={finalSize}
        className="pointer-events-none select-none"
        style={{
          transform: `rotate(${item.rotation}deg) scaleX(${item.flipped ? -1 : 1})`,
        }}
        draggable={false}
      />

      {/* Selection overlay: bounding box + handles */}
      {isSelected && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${-halfSize - 4}px`,
            top: `${-halfSize - 4}px`,
            width: `${finalSize + 8}px`,
            height: `${finalSize + 8}px`,
          }}
        >
          {/* Bounding box border */}
          <div
            className="absolute inset-0"
            style={{
              border: '1.5px solid rgba(0,0,0,0.4)',
              borderRadius: '2px',
            }}
          />

          {/* Corner resize handles */}
          {[
            { corner: 'nw', left: `${-handleSize / 2}px`, top: `${-handleSize / 2}px`, cursor: 'nw-resize' },
            { corner: 'ne', right: `${-handleSize / 2}px`, top: `${-handleSize / 2}px`, cursor: 'ne-resize' },
            { corner: 'sw', left: `${-handleSize / 2}px`, bottom: `${-handleSize / 2}px`, cursor: 'sw-resize' },
            { corner: 'se', right: `${-handleSize / 2}px`, bottom: `${-handleSize / 2}px`, cursor: 'se-resize' },
          ].map((h) => (
            <div
              key={h.corner}
              onPointerDown={(e) => handleResizePointerDown(e, h.corner)}
              className="absolute"
              style={{
                width: `${handleSize}px`,
                height: `${handleSize}px`,
                background: '#fff',
                border: '1.5px solid rgba(0,0,0,0.5)',
                borderRadius: '1px',
                cursor: h.cursor,
                pointerEvents: 'auto',
                zIndex: 10,
                ...h,
              }}
            />
          ))}

          {/* Rotate handle: line + circle above top-center */}
          <div
            className="absolute"
            style={{
              left: '50%',
              top: `${-rotateHandleOffset - handleSize}px`,
              transform: 'translateX(-50%)',
              pointerEvents: 'auto',
              zIndex: 10,
            }}
          >
            {/* Connecting line */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: `${handleSize}px`,
                width: '1px',
                height: `${rotateHandleOffset - handleSize}px`,
                background: 'rgba(0,0,0,0.3)',
                transform: 'translateX(-50%)',
              }}
            />
            {/* Rotate circle handle */}
            <div
              onPointerDown={handleRotatePointerDown}
              style={{
                width: `${handleSize + 4}px`,
                height: `${handleSize + 4}px`,
                background: '#fff',
                border: '1.5px solid rgba(0,0,0,0.5)',
                borderRadius: '50%',
                cursor: 'grab',
                pointerEvents: 'auto',
              }}
            />
          </div>

          {/* Delete button: top-right */}
          <div
            onPointerDown={handleDelete}
            className="absolute"
            style={{
              right: `${-28}px`,
              top: `${-28}px`,
              width: '22px',
              height: '22px',
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              pointerEvents: 'auto',
              zIndex: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5">
              <line x1="2" y1="2" x2="8" y2="8" />
              <line x1="8" y1="2" x2="2" y2="8" />
            </svg>
          </div>

          {/* Duplicate button: top-left */}
          <div
            onPointerDown={handleDuplicate}
            className="absolute"
            style={{
              left: `${-28}px`,
              top: `${-28}px`,
              width: '22px',
              height: '22px',
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              pointerEvents: 'auto',
              zIndex: 10,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="1.2">
              <rect x="1" y="3" width="5.5" height="5.5" rx="0.5" />
              <rect x="3.5" y="1" width="5.5" height="5.5" rx="0.5" />
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );
}
