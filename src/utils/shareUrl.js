function randomInRange(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function generateFallbackPlacement(flowerIds) {
  let z = 1;
  return flowerIds.map((flowerId) => {
    z += 1;
    return {
      id: `${flowerId}-${z}`,
      flowerId,
      x: randomInRange(-100, 100),
      y: randomInRange(-80, 60),
      rotation: randomInRange(-15, 15),
      scale: 1.0,
      z,
      flipped: false,
    };
  });
}

export function encodeBouquetState(mode, placedFlowers, letter, extras = {}) {
  const params = new URLSearchParams();
  if (placedFlowers.length) {
    params.set('flowers', placedFlowers.map((f) => f.flowerId).join(','));
    const compact = placedFlowers.map((f) =>
      [f.flowerId, Math.round(f.x), Math.round(f.y), Math.round(f.rotation), Math.round(f.scale * 100), f.z, f.flipped ? 1 : 0].join(':')
    ).join(';');
    params.set('p', compact);
  }
  if (mode !== 'color') params.set('mode', mode);
  if (letter.message) params.set('message', letter.message);
  if (letter.recipient) params.set('recipient', letter.recipient);
  if (letter.sender) params.set('sender', letter.sender);

  if (extras.music && extras.music.type !== 'none') {
    params.set('mt', extras.music.type);
    if (extras.music.source) params.set('ms', extras.music.source);
    if (extras.music.preset) params.set('mp', extras.music.preset);
  }
  if (extras.wrap && extras.wrap !== 'ivory') params.set('wrap', extras.wrap);
  if (extras.ribbon) {
    if (extras.ribbon.material !== 'satin') params.set('rm', extras.ribbon.material);
    if (extras.ribbon.color !== 'white') params.set('rc', extras.ribbon.color);
  }
  if (extras.background && extras.background !== 'none') params.set('bg', extras.background);

  const qs = params.toString();
  return qs ? `${window.location.origin}${window.location.pathname}?${qs}` : window.location.href;
}

export function decodeBouquetState() {
  const params = new URLSearchParams(window.location.search);
  const flowersStr = params.get('flowers');
  const placementStr = params.get('p');
  const mode = params.get('mode');
  const message = params.get('message');
  const recipient = params.get('recipient');
  const sender = params.get('sender');
  const flowerIds = flowersStr
    ? [...new Set(flowersStr.split(',').filter(Boolean))]
    : [];

  let placedFlowers = [];
  if (placementStr) {
    try {
      placedFlowers = placementStr.split(';').filter(Boolean).map((entry) => {
        const [flowerId, x, y, rotation, scale, z, flipped] = entry.split(':');
        return {
          id: `${flowerId}-${z}`,
          flowerId,
          x: Number(x) || 0,
          y: Number(y) || 0,
          rotation: Number(rotation) || 0,
          scale: (Number(scale) || 100) / 100,
          z: Number(z) || 1,
          flipped: flipped === '1',
        };
      });
    } catch {
      placedFlowers = generateFallbackPlacement(flowerIds);
    }
  } else if (flowerIds.length > 0) {
    placedFlowers = generateFallbackPlacement(flowerIds);
  }

  const mt = params.get('mt');
  const music = {
    type: mt || 'none',
    source: params.get('ms') || '',
    preset: params.get('mp') || '',
  };

  const wrap = params.get('wrap') || 'ivory';

  const ribbon = {
    material: params.get('rm') || 'satin',
    color: params.get('rc') || 'white',
  };

  const background = params.get('bg') || 'none';

  return {
    placedFlowers,
    mode: mode === 'mono' ? 'mono' : 'color',
    letter: { sender: sender || '', recipient: recipient || '', message: message || '' },
    music,
    wrap,
    ribbon,
    background,
  };
}
