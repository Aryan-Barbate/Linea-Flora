import { useState } from 'react';
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
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`}
      allow="autoplay; encrypted-media"
      allowFullScreen={false}
      title="bg-music"
      style={{ position: 'absolute', top: 0, left: 0, width: '320px', height: '180px', border: 'none' }}
    />
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
  const [isPlaying, setIsPlaying] = useState(true);

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
    <>
      {isPlaying && (
        <div className="relative" style={{ height: 0, overflow: 'hidden' }}>
          {(music.type === 'youtube' && ytId) && <YouTubeEmbed videoId={ytId} />}
          {(music.type === 'spotify' && spId) && <SpotifyEmbed trackId={spId} />}
          {(music.type === 'preset' && presetVideoId) && <YouTubeEmbed videoId={presetVideoId} />}
          {(music.type === 'custom' && music.source) && (
            <audio src={music.source} loop autoPlay style={{ display: 'none' }} />
          )}
        </div>
      )}

      {createPortal(
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="fixed bottom-6 right-6 z-50 bg-[#121212]/90 backdrop-blur-md text-[#FDFBF7] hover:bg-black px-4 py-2.5 rounded-full flex items-center gap-2.5 text-xs font-mono tracking-widest shadow-lg border border-white/10 transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]"
          title={isPlaying ? "Mute music" : "Play music"}
        >
          {isPlaying ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>♪ MUSIC: ON ({label})</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-500/80"></span>
              <span>🔇 MUSIC: OFF</span>
            </>
          )}
        </button>,
        document.body
      )}
    </>
  );
}
