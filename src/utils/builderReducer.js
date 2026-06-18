import { clampPosition, getFlowerZIndex } from '../context/BouquetContext';

let instanceCounter = 0;

function makeId(flowerId) {
  instanceCounter += 1;
  return `${flowerId}-${instanceCounter}`;
}

export function builderReducer(state, action) {
  switch (action.type) {
    case 'ADD_FLOWER': {
      const { flowerId } = action;
      const z = getFlowerZIndex(state);
      const newItem = {
        id: makeId(flowerId),
        flowerId,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1.0,
        z,
        flipped: false,
      };
      return [...state, newItem];
    }

    case 'MOVE_FLOWER': {
      const { id, x, y } = action;
      const clamped = clampPosition(x, y);
      return state.map((item) =>
        item.id === id ? { ...item, x: clamped.x, y: clamped.y } : item
      );
    }

    case 'SET_POSITION': {
      const { id, x, y, rotation, scale } = action;
      const clamped = clampPosition(x, y);
      return state.map((item) =>
        item.id === id
          ? {
              ...item,
              x: clamped.x,
              y: clamped.y,
              rotation: rotation !== undefined ? rotation : item.rotation,
              scale: scale !== undefined ? Math.max(0.4, Math.min(2.5, scale)) : item.scale,
            }
          : item
      );
    }

    case 'ROTATE_FLOWER': {
      const { id, delta } = action;
      return state.map((item) =>
        item.id === id
          ? { ...item, rotation: Math.round((item.rotation + delta) * 10) / 10 }
          : item
      );
    }

    case 'SCALE_FLOWER': {
      const { id, delta } = action;
      return state.map((item) =>
        item.id === id
          ? { ...item, scale: Math.max(0.4, Math.min(2.5, Math.round((item.scale + delta) * 100) / 100)) }
          : item
      );
    }

    case 'SET_SCALE': {
      const { id, scale } = action;
      return state.map((item) =>
        item.id === id
          ? { ...item, scale: Math.max(0.4, Math.min(2.5, Math.round(scale * 100) / 100)) }
          : item
      );
    }

    case 'SET_ROTATION': {
      const { id, rotation } = action;
      return state.map((item) =>
        item.id === id
          ? { ...item, rotation: Math.round(rotation * 10) / 10 }
          : item
      );
    }

    case 'FLIP_FLOWER': {
      const { id } = action;
      return state.map((item) =>
        item.id === id ? { ...item, flipped: !item.flipped } : item
      );
    }

    case 'DUPLICATE_FLOWER': {
      const { id } = action;
      const source = state.find((item) => item.id === id);
      if (!source) return state;
      const z = getFlowerZIndex(state);
      const duplicate = {
        ...source,
        id: makeId(source.flowerId),
        x: source.x + 15,
        y: source.y + 10,
        z,
      };
      return [...state, duplicate];
    }

    case 'DELETE_FLOWER': {
      const { id } = action;
      return state.filter((item) => item.id !== id);
    }

    case 'BRING_FORWARD': {
      const { id } = action;
      const maxZ = state.length > 0 ? Math.max(...state.map((f) => f.z)) : 0;
      return state.map((item) =>
        item.id === id ? { ...item, z: maxZ + 1 } : item
      );
    }

    case 'SEND_BACKWARD': {
      const { id } = action;
      const minZ = state.length > 0 ? Math.min(...state.map((f) => f.z)) : 0;
      return state.map((item) =>
        item.id === id ? { ...item, z: minZ - 1 } : item
      );
    }

    case 'CLEAR_ALL': {
      return [];
    }

    default:
      return state;
  }
}
