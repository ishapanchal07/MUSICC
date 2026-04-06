import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track } from '../data/mockData';

export interface Playlist {
  id: string;
  name: string;
  coverImage?: string;
  tracks: Track[];
}

interface LibraryContextType {
  likedSongs: Track[];
  playlists: Playlist[];
  toggleLike: (track: Track) => void;
  isLiked: (trackId: string) => boolean;
  createPlaylist: (name: string, coverImage?: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within LibraryProvider');
  return context;
};

export const LibraryProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    try {
      const likedStr = await AsyncStorage.getItem('likedSongs');
      const playlistsStr = await AsyncStorage.getItem('playlists');
      if (likedStr) setLikedSongs(JSON.parse(likedStr));
      if (playlistsStr) setPlaylists(JSON.parse(playlistsStr));
    } catch (e) {
      console.error(e);
    }
  };

  const saveToStorage = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleLike = (track: Track) => {
    setLikedSongs(prev => {
      const exists = prev.find(t => t.id === track.id);
      const newSongs = exists ? prev.filter(t => t.id !== track.id) : [...prev, track];
      saveToStorage('likedSongs', newSongs);
      return newSongs;
    });
  };

  const isLiked = (trackId: string) => likedSongs.some(t => t.id === trackId);

  const createPlaylist = (name: string, coverImage?: string) => {
    setPlaylists(prev => {
      const newPlaylist: Playlist = { id: Date.now().toString(), name, coverImage, tracks: [] };
      const newPlaylists = [...prev, newPlaylist];
      saveToStorage('playlists', newPlaylists);
      return newPlaylists;
    });
  };

  const addToPlaylist = (playlistId: string, track: Track) => {
    setPlaylists(prev => {
      const newPlaylists = prev.map(p => {
        if (p.id === playlistId && !p.tracks.find(t => t.id === track.id)) {
          return { ...p, tracks: [...p.tracks, track] };
        }
        return p;
      });
      saveToStorage('playlists', newPlaylists);
      return newPlaylists;
    });
  };

  return (
    <LibraryContext.Provider value={{ likedSongs, playlists, toggleLike, isLiked, createPlaylist, addToPlaylist }}>
      {children}
    </LibraryContext.Provider>
  );
};
