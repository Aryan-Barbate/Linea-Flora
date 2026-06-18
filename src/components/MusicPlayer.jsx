import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const PRESET_YOUTUBE = {
  'romantic': 'vt4jX0iRgCg',
  'soft-piano': 'DjjIo8uPhZI',
  'lofi': 'njeZmrcWOgg',
  'dreamy': 'vt4jX0iRgCg',
  'instrumental': '0L0TMA_q0-c',
  'acoustic': 'DjjIo8uPhZI',
};

function extractYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0];
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    if (u.pathname.startsWith('/embed/')) return u.pathname.split('/embed/')[1]?.split('?')[0];
  } catch { /* invalid */ }
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function extractSpotifyId(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    const t = parts.indexOf('track');
    if (t !== -1 && parts[t + 1]) return parts[t + 1].split('?')[0];
    const a = parts.indexOf('album');
    if (a !== -1 && parts[a + 1]) return `album/${parts[a + 1].split('?')[0]}`;
  } catch { /* invalid */ }
  return null;
}

function YouTubeEmbed({ videoId }) {
  const iframeRef = useRef(null);
  const [needClick, setNeedClick] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setNeedClick(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const restart = () => {
    setKey((k) => k + 1);
    setNeedClick(false);
  };

  return (
    <>
      <iframe
        key={key}
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`}
        allow="autoplay; encrypted-media"
        allowFullScreen={false}
        title="bg-music"
        style={{ position: 'absolute', top: 0, left: 0, width: '320px', height: '180px', border: 'none' }}
      />
      {needClick && createPortal(
        <button
          onClick={restart}
          className="fixed bottom-4 right-4 z-50 bg-black text-beige w-10 h-10 flex items-center justify-center text-sm hover:bg-black/80 transition-colors shadow-md font-mono"
          title="Click to play music"
        >
          ♪
        </button>,
        document.body
      )}
    </>
  );
}

function SpotifyEmbed({ trackId }) {
  return (
    <iframe
      src={`https://open.spotify.com/embed/${trackId}?utm_source=generator&theme=0&autoplay=1`}
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="bg-music"
      style={{ position: 'absolute', top: 0, left: 0, width: '320px', height: '80px', border: 'none' }}
    />
  );
}

export default function MusicPlayer({ music }) {
  if (!music || music.type === 'none') return null;

  const presetLabel = music.type === 'preset' ? music.preset?.replace(/-/g, ' ') : null;
  const presetVideoId = music.type === 'preset' ? PRESET_YOUTUBE[music.preset] : null;
  const ytId = music.type === 'youtube' ? extractYouTubeId(music.source) : null;
  const spId = music.type === 'spotify' ? extractSpotifyId(music.source) : null;

  const label = music.type === 'preset' ? presetLabel
    : music.type === 'youtube' ? 'YouTube'
    : music.type === 'spotify' ? 'Spotify'
    : 'Custom';

  return (
    <div className="relative mb-3" style={{ height: 0, overflow: 'hidden' }}>
      {(music.type === 'youtube' && ytId) && <YouTubeEmbed videoId={ytId} />}
      {(music.type === 'spotify' && spId) && <SpotifyEmbed trackId={spId} />}
      {(music.type === 'preset' && presetVideoId) && <YouTubeEmbed videoId={presetVideoId} />}
      {(music.type === 'custom' && music.source) && (
        <audio src={music.source} loop autoPlay style={{ display: 'none' }} />
      )}

      <div className="flex items-center gap-2 font-mono text-[10px] text-black/40 uppercase tracking-widest">
        <span>♪ {label}</span>
      </div>
    </div>
  );
}
