export interface Track {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  url: string;
  duration: number;
}

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'A New Beginning',
    artist: 'SoundHelix',
    artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 140
  },
  {
    id: '2',
    title: 'Summer Breeze',
    artist: 'SoundHelix',
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 160
  },
  {
    id: '3',
    title: 'Epic Journey',
    artist: 'SoundHelix',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a1a2a5ea77ad?w=500&q=80',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 180
  },
  {
    id: '4',
    title: 'Melancholy',
    artist: 'SoundHelix',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 200
  },
];
