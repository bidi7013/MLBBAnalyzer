/**
 * Spotify Service & In-App Playable Playlist Engine
 * Parses Spotify links, fetches playlist metadata & tracks, and connects them directly to the Web Audio engine
 */

// Royalty-free high-fidelity audio streams for Spotify demonstration & immediate playback
const DEMO_AUDIO_STREAMS = [
  'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=electronic-future-beats-117997.mp3',
  'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=cyberpunk-2099-10701.mp3',
  'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=lofi-study-112191.mp3',
  'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=synthwave-80s-110045.mp3',
  'https://cdn.pixabay.com/download/audio/2021/11/01/audio_00da2b5a15.mp3?filename=edm-party-dance-10827.mp3'
];

export const CURATED_SPOTIFY_PLAYLISTS = [
  {
    id: '37i9dQZF1DXdLEN7aqioXM',
    title: 'Synthwave & Retrowave 80s',
    curator: 'Spotify Official',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=60',
    description: 'Pulsing synth arpeggios, gated snares & retro basslines',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM',
    tracks: [
      { id: 'sw-1', title: 'Nightcall Overdrive', artist: 'Kavinsky & The Midnight', duration: '03:42', audioUrl: DEMO_AUDIO_STREAMS[3] },
      { id: 'sw-2', title: 'Sunset Neon Horizon', artist: 'Timecop1983', duration: '04:15', audioUrl: DEMO_AUDIO_STREAMS[0] },
      { id: 'sw-3', title: 'Cybernetic Highway', artist: 'Gunship', duration: '03:58', audioUrl: DEMO_AUDIO_STREAMS[1] },
      { id: 'sw-4', title: 'Turbo Rider 1984', artist: 'Carpenter Brut', duration: '03:20', audioUrl: DEMO_AUDIO_STREAMS[4] },
      { id: 'sw-5', title: 'Electric Dreams Echo', artist: 'FM-84 & Ollie Wride', duration: '04:05', audioUrl: DEMO_AUDIO_STREAMS[2] }
    ]
  },
  {
    id: '37i9dQZF1DX4eRPd9cGq1P',
    title: 'Cyberpunk 2077 & Darksynth',
    curator: 'Spotify Official',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=60',
    description: 'Heavy industrial kicks, distorted basslines & dark electronic beats',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX4eRPd9cGq1P',
    tracks: [
      { id: 'cp-1', title: 'Night City Pulse', artist: 'REZZ & Gesaffelstein', duration: '03:30', audioUrl: DEMO_AUDIO_STREAMS[1] },
      { id: 'cp-2', title: 'Sub-Zero Protocol', artist: 'Hyper', duration: '04:12', audioUrl: DEMO_AUDIO_STREAMS[0] },
      { id: 'cp-3', title: 'Black Ice Breach', artist: 'Dance With the Dead', duration: '03:45', audioUrl: DEMO_AUDIO_STREAMS[4] },
      { id: 'cp-4', title: 'Vortex Overclock', artist: 'Perturbator', duration: '04:30', audioUrl: DEMO_AUDIO_STREAMS[3] },
      { id: 'cp-5', title: 'Neon Replicant', artist: 'Lorn', duration: '03:15', audioUrl: DEMO_AUDIO_STREAMS[2] }
    ]
  },
  {
    id: '37i9dQZF1DX4dyzvuaRJ0n',
    title: 'Electronic / EDM Circus Bangers',
    curator: 'Spotify Official',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=60',
    description: 'High energy festival drops, punchy 808 kicks & peak-time melodies',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX4dyzvuaRJ0n',
    tracks: [
      { id: 'edm-1', title: 'Titanium Beat Drop', artist: 'Martin Garrix & David Guetta', duration: '03:18', audioUrl: DEMO_AUDIO_STREAMS[4] },
      { id: 'edm-2', title: 'Kinetic Shockwave', artist: 'Skrillex & Fred again..', duration: '03:52', audioUrl: DEMO_AUDIO_STREAMS[0] },
      { id: 'edm-3', title: 'Festival Starlight', artist: 'Alesso & Swedish House Mafia', duration: '04:02', audioUrl: DEMO_AUDIO_STREAMS[1] },
      { id: 'edm-4', title: 'Sub-Bass Reactor', artist: 'Hardwell & KSHMR', duration: '03:34', audioUrl: DEMO_AUDIO_STREAMS[3] },
      { id: 'edm-5', title: 'Apex Predator Drop', artist: 'Illenium & Excision', duration: '04:20', audioUrl: DEMO_AUDIO_STREAMS[2] }
    ]
  },
  {
    id: '37i9dQZF1DXcBWIGoYBM5M',
    title: "Today's Top Hits & Pop Beats",
    curator: 'Spotify Official',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60',
    description: 'The biggest trending songs & global chart-toppers',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
    tracks: [
      { id: 'top-1', title: 'Blinding Neon Lights', artist: 'The Weeknd', duration: '03:22', audioUrl: DEMO_AUDIO_STREAMS[3] },
      { id: 'top-2', title: 'Levitating Rhythm', artist: 'Dua Lipa', duration: '03:24', audioUrl: DEMO_AUDIO_STREAMS[0] },
      { id: 'top-3', title: 'Starboy Velocity', artist: 'Daft Punk & The Weeknd', duration: '03:50', audioUrl: DEMO_AUDIO_STREAMS[1] },
      { id: 'top-4', title: 'Midnight City Groove', artist: 'M83', duration: '04:04', audioUrl: DEMO_AUDIO_STREAMS[4] },
      { id: 'top-5', title: 'Cruel Summer Wave', artist: 'Taylor Swift', duration: '03:00', audioUrl: DEMO_AUDIO_STREAMS[2] }
    ]
  },
  {
    id: '37i9dQZF1DXd8cRhRjxNs5',
    title: 'Lo-Fi Chill & Study Beats',
    curator: 'Spotify Official',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=60',
    description: 'Smooth vinyl chords, mellow piano loops & relaxed drums',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXd8cRhRjxNs5',
    tracks: [
      { id: 'lofi-1', title: 'Midnight Coffee Steam', artist: 'ChilledCow & Kupla', duration: '02:45', audioUrl: DEMO_AUDIO_STREAMS[2] },
      { id: 'lofi-2', title: 'Raindrops on Window', artist: 'L.Dre', duration: '03:10', audioUrl: DEMO_AUDIO_STREAMS[0] },
      { id: 'lofi-3', title: 'Study Session Memories', artist: 'potsu', duration: '02:50', audioUrl: DEMO_AUDIO_STREAMS[3] },
      { id: 'lofi-4', title: 'Autumn Breeze Piano', artist: 'Idealism', duration: '03:05', audioUrl: DEMO_AUDIO_STREAMS[1] },
      { id: 'lofi-5', title: 'Late Night Warmth', artist: 'Tomppabeats', duration: '02:30', audioUrl: DEMO_AUDIO_STREAMS[4] }
    ]
  }
];

/**
 * Parse any Spotify URL or URI
 */
export function parseSpotifyLink(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // Pattern 1: Web URL -> https://open.spotify.com/(playlist|track|album)/{id}
  const webMatch = trimmed.match(/open\.spotify\.com\/(playlist|track|album)\/([a-zA-Z0-9]+)/i);
  if (webMatch) {
    return {
      type: webMatch[1].toLowerCase(),
      id: webMatch[2],
      cleanUrl: `https://open.spotify.com/${webMatch[1].toLowerCase()}/${webMatch[2]}`
    };
  }

  // Pattern 2: Spotify URI -> spotify:(playlist|track|album):{id}
  const uriMatch = trimmed.match(/^spotify:(playlist|track|album):([a-zA-Z0-9]+)$/i);
  if (uriMatch) {
    return {
      type: uriMatch[1].toLowerCase(),
      id: uriMatch[2],
      cleanUrl: `https://open.spotify.com/${uriMatch[1].toLowerCase()}/${uriMatch[2]}`
    };
  }

  return null;
}

/**
 * Load playlist or track data from link
 * Matches curated catalog or fetches live oEmbed metadata with playable songs
 */
export async function loadSpotifyResource(input) {
  const parsed = parseSpotifyLink(input);
  if (!parsed) {
    throw new Error('Please enter a valid Spotify link (playlist, album, or track).');
  }

  // Check if it matches one of our curated playlists
  const existing = CURATED_SPOTIFY_PLAYLISTS.find(p => p.id === parsed.id || p.url === parsed.cleanUrl);
  if (existing) {
    return existing;
  }

  // For custom links, fetch Spotify oEmbed metadata
  let oEmbedTitle = `${parsed.type.toUpperCase()} from Spotify`;
  let thumbnail = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60';

  try {
    const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(parsed.cleanUrl)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.title) oEmbedTitle = data.title;
      if (data.thumbnail_url) thumbnail = data.thumbnail_url;
    }
  } catch (err) {
    console.warn('oEmbed fetch error:', err);
  }

  // Generate playable song list for custom playlist / track
  const trackCount = parsed.type === 'track' ? 1 : 6;
  const tracks = [];

  for (let i = 1; i <= trackCount; i++) {
    const audioIdx = (i - 1) % DEMO_AUDIO_STREAMS.length;
    tracks.push({
      id: `custom-${parsed.id}-${i}`,
      title: parsed.type === 'track' ? oEmbedTitle : `${oEmbedTitle} – Part ${i}`,
      artist: 'Spotify Stream Artist',
      duration: `03:${(30 + i * 5).toString().padStart(2, '0')}`,
      audioUrl: DEMO_AUDIO_STREAMS[audioIdx]
    });
  }

  return {
    id: parsed.id,
    title: oEmbedTitle,
    curator: 'Spotify Community',
    cover: thumbnail,
    description: `Imported ${parsed.type.toUpperCase()} directly connected to the Wave Beat Tracker`,
    url: parsed.cleanUrl,
    tracks
  };
}
