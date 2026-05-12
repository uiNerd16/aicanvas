// @ts-nocheck — design-systems/ is not type-checked (see design-systems/CLAUDE.md). Strip this after a proper typing pass.
// ============================================================
// SIGNAL ROOM DEMO DATA
// A music app re-interpreted as an audio transmission control
// room. Tracks are signal feeds, playlists are channels, the
// "now playing" card is the active transmission.
// ============================================================

import {
  SquaresFour,
  MagnifyingGlass,
  WaveSine,
  Stack,
  Broadcast,
  Heart,
  Archive,
} from '@phosphor-icons/react';

// ---- Sidebar nav ----
export const navItems = [
  { id: 'library',    label: 'Library',    icon: SquaresFour      },
  { id: 'search',     label: 'Search',     icon: MagnifyingGlass  },
  { id: 'channels',   label: 'Channels',   icon: Broadcast        },
  { id: 'waveforms',  label: 'Waveforms',  icon: WaveSine         },
  { id: 'favourites', label: 'Favourites', icon: Heart            },
  { id: 'archive',    label: 'Archive',    icon: Archive          },
];

// ---- Sidebar: pinned channels (replaces "Playlists" rail) ----
export const channels = [
  { id: 'chill-vibes',   code: 'CH-04', name: 'Chill Vibes',   tracks: 50,  bitrate: 320 },
  { id: 'morning-rush',  code: 'CH-07', name: 'Morning Rush',  tracks: 30,  bitrate: 320 },
  { id: 'deep-focus',    code: 'CH-12', name: 'Deep Focus',    tracks: 100, bitrate: 256 },
  { id: 'road-trip',     code: 'CH-18', name: 'Road Trip',     tracks: 42,  bitrate: 320 },
  { id: 'liked-radio',   code: 'CH-21', name: 'Liked Radio',   tracks: 75,  bitrate: 256 },
];

// ---- Now Transmitting: hero readouts (replaces "Sound without limits") ----
export const nowTransmittingStats = [
  { code: 'SIG-01', label: 'Signal',  value: '98',  unit: '%',    delta: 0.4,  deltaLabel: 'lock'    },
  { code: 'SIG-02', label: 'Bitrate', value: '320', unit: 'KBPS', delta: 0,    deltaLabel: 'stable'  },
  { code: 'SIG-03', label: 'Latency', value: '12',  unit: 'MS',   delta: -1,   deltaLabel: 'last 60s'},
  { code: 'SIG-04', label: 'Channel', value: '04',  unit: 'LIVE', delta: 0,    deltaLabel: 'nominal' },
];

// ---- "Made for you" → "Routines" (5 personalised mixes) ----
// Background images: cool-toned cosmic abstracts (Unsplash). Each card
// renders the image at low opacity behind a vertical gradient overlay so
// the signal meter + text stay legible. Photo IDs reused from
// mission-control where they're already known to load.
export const mixes = [
  { code: 'MIX-01', name: 'Your Mix',       desc: 'Updates daily', plays: '3.4k', signal: 92,
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=640&auto=format&fit=crop&q=80' },
  { code: 'MIX-02', name: 'Chill Mix',      desc: 'Updates daily', plays: '1.8k', signal: 84,
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=640&auto=format&fit=crop&q=80' },
  { code: 'MIX-03', name: 'Focus Mix',      desc: 'Updates daily', plays: '5.1k', signal: 76,
    image: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=640&auto=format&fit=crop&q=80' },
  { code: 'MIX-04', name: 'New Music Mix',  desc: 'Updates daily', plays: '912',  signal: 68,
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=640&auto=format&fit=crop&q=80' },
];

// ---- Recent transmissions table (replaces "Jump back in") ----
export const recentTransmissions = [
  { id: 'REC-2041', track: 'Blinding Lights', artist: 'The Weeknd',    duration: '3:20', plays: 142, peak: 86, last: 'T-02m' },
  { id: 'REC-2039', track: 'Sunflower',       artist: 'Post Malone',   duration: '2:38', plays: 98,  peak: 74, last: 'T-14m' },
  { id: 'REC-2037', track: 'Save Your Tears', artist: 'The Weeknd',    duration: '3:35', plays: 211, peak: 91, last: 'T-32m' },
  { id: 'REC-2032', track: 'Heat Waves',      artist: 'Glass Animals', duration: '3:58', plays: 76,  peak: 68, last: 'T-1h'  },
  { id: 'REC-2028', track: 'Another Love',    artist: 'Tom Odell',     duration: '4:04', plays: 184, peak: 82, last: 'T-2h'  },
  { id: 'REC-2024', track: 'Levitating',      artist: 'Dua Lipa',      duration: '3:23', plays: 132, peak: 79, last: 'T-3h'  },
  { id: 'REC-2019', track: 'As It Was',       artist: 'Harry Styles',  duration: '2:47', plays: 168, peak: 84, last: 'T-4h'  },
];

// ---- Output levels panel (replaces equalizer / volume meters) ----
export const channelLevels = [
  { name: 'Master Out',  status: 'nominal', value: 88  },
  { name: 'Sub Bass',    status: 'nominal', value: 64  },
  { name: 'Low Mid',     status: 'nominal', value: 78  },
  { name: 'High Mid',    status: 'caution', value: 92  },
  { name: 'Treble',      status: 'nominal', value: 70  },
  { name: 'Air',         status: 'nominal', value: 52  },
];

export const levelStatusVariant = {
  nominal: 'accent',
  caution: 'warning',
  fault:   'fault',
};

export const levelStatusLabel = {
  nominal: 'OK',
  caution: 'Hot',
  fault:   'Clip',
};

export const levelProgressVariant = {
  nominal: 'default',
  caution: 'warning',
  fault:   'fault',
};

// ---- Transport: currently playing track ----
export const nowPlaying = {
  track:    'Dawn FM',
  artist:   'The Weeknd',
  album:    'Dawn FM',
  duration: 221,     // 3:41
  elapsed:  87,      // 1:27
  code:     'TX-001',
  bitrate:  320,
};
