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

// Compress string to base64url using gzip
async function compress(str) {
  const bytes = new TextEncoder().encode(str);
  const stream = new Blob([bytes]).stream();
  const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
  const buffer = await new Response(compressedStream).arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Decompress base64url using gzip
async function decompress(base64url) {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  
  const stream = new Blob([bytes]).stream();
  const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
  const buffer = await new Response(decompressedStream).arrayBuffer();
  return new TextDecoder().decode(buffer);
}

/**
 * Build the compact bouquet state object used for both Redis storage
 * and the legacy compressed URL format.
 */
function buildCompactState(mode, placedFlowers, letter, extras = {}) {
  return {
    m: mode === 'mono' ? 1 : 0,
    f: placedFlowers.map((f) => [
      f.flowerId,
      Math.round(f.x),
      Math.round(f.y),
      Math.round(f.rotation),
      Math.round(f.scale * 100),
      f.z,
      f.flipped ? 1 : 0
    ]),
    l: [letter.sender || '', letter.recipient || '', letter.message || ''],
    mu: [extras.music?.type || 'none', extras.music?.source || '', extras.music?.preset || ''],
    w: extras.wrap || 'ivory',
    r: [extras.ribbon?.material || 'satin', extras.ribbon?.color || 'white'],
    bg: extras.background || 'none'
  };
}

/**
 * Parse the compact bouquet state object back into app state.
 */
function parseCompactState(stateObj) {
  const placedFlowers = (stateObj.f || []).map((arr) => {
    const [flowerId, x, y, rotation, scale, z, flipped] = arr;
    return {
      id: `${flowerId}-${z}`,
      flowerId,
      x: Number(x) || 0,
      y: Number(y) || 0,
      rotation: Number(rotation) || 0,
      scale: (Number(scale) || 100) / 100,
      z: Number(z) || 1,
      flipped: flipped === 1
    };
  });

  return {
    placedFlowers,
    mode: stateObj.m === 1 ? 'mono' : 'color',
    letter: {
      sender: stateObj.l?.[0] || '',
      recipient: stateObj.l?.[1] || '',
      message: stateObj.l?.[2] || ''
    },
    music: {
      type: stateObj.mu?.[0] || 'none',
      source: stateObj.mu?.[1] || '',
      preset: stateObj.mu?.[2] || ''
    },
    wrap: stateObj.w || 'ivory',
    ribbon: {
      material: stateObj.r?.[0] || 'satin',
      color: stateObj.r?.[1] || 'white'
    },
    background: stateObj.bg || 'none'
  };
}

// ─── NEW: Redis-backed short URL sharing ────────────────────────────

/**
 * Create a short share link by saving bouquet data to Redis via API.
 * Returns the short URL string, e.g. "https://linea-flora-ab.vercel.app/b/abc123xyz"
 *
 * Falls back to the legacy encoded URL if the API call fails.
 */
export async function createShareLink(mode, placedFlowers, letter, extras = {}) {
  const stateObj = buildCompactState(mode, placedFlowers, letter, extras);

  try {
    const response = await fetch('/api/bouquet/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stateObj),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const { shareUrl } = await response.json();
    return shareUrl;
  } catch (err) {
    console.error('Failed to create share link, falling back to encoded URL:', err);
    // Fallback to legacy encoded URL
    return encodeBouquetState(mode, placedFlowers, letter, extras);
  }
}

/**
 * Fetch shared bouquet data from Redis via API.
 * Returns the parsed bouquet state or null if not found.
 */
export async function fetchSharedBouquet(id) {
  const response = await fetch(`/api/bouquet/get?id=${encodeURIComponent(id)}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch bouquet: ${response.status}`);
  }

  const data = await response.json();
  return parseCompactState(data);
}

// ─── LEGACY: Encoded URL sharing (kept for backward compatibility) ──

export async function encodeBouquetState(mode, placedFlowers, letter, extras = {}) {
  // Check for CompressionStream support
  if (typeof CompressionStream !== 'undefined') {
    try {
      const stateObj = buildCompactState(mode, placedFlowers, letter, extras);
      
      const compressedStr = await compress(JSON.stringify(stateObj));
      return `${window.location.origin}${window.location.pathname}?s=${compressedStr}`;
    } catch (err) {
      console.error('Failed to compress state, falling back to plaintext URL:', err);
    }
  }

  // Fallback to old query string format if CompressionStream is not supported or fails
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

export async function decodeBouquetState() {
  const params = new URLSearchParams(window.location.search);
  const s = params.get('s');

  if (s) {
    try {
      if (typeof DecompressionStream !== 'undefined') {
        const decodedStr = await decompress(s);
        const stateObj = JSON.parse(decodedStr);
        return parseCompactState(stateObj);
      }
    } catch (err) {
      console.error('Failed to decompress state:', err);
    }
  }

  // Fallback to decoding the old URL format
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
