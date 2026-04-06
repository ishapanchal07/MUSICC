import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Track } from '../data/mockData';

export type RepeatMode = 'OFF' | 'ALL' | 'ONE';

interface PlayerContextType {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  position: number;
  duration: number;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  playTrack: (track: Track, queueList?: Track[]) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  seek: (positionMillis: number) => Promise<void>;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};

export const PlayerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [originalQueue, setOriginalQueue] = useState<Track[]>([]);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('OFF');
  
  // expo-audio hook
  const player = useAudioPlayer(currentTrack ? { uri: currentTrack.url } : null);
  const status = useAudioPlayerStatus(player);

  const position = (status.currentTime || 0) * 1000;
  const duration = (status.duration || 0) * 1000;
  const isPlaying = player.playing;
  
  const stateRef = useRef({ queue, currentTrack, isShuffle, repeatMode, originalQueue });
  useEffect(() => {
    stateRef.current = { queue, currentTrack, isShuffle, repeatMode, originalQueue };
  }, [queue, currentTrack, isShuffle, repeatMode, originalQueue]);

  // Track end detection
  const hasTriggeredEndRef = useRef(false);
  useEffect(() => {
    hasTriggeredEndRef.current = false;
    // When a new track loads, we make sure it plays
    if (currentTrack) {
       player.play();
    }
  }, [currentTrack]);

  useEffect(() => {
    // Check if within 0.1s of duration since exact floating match could miss if it pauses exactly at boundary
    if (status.duration > 0 && status.currentTime >= status.duration - 0.1) {
      if (!hasTriggeredEndRef.current) {
        hasTriggeredEndRef.current = true;
        handleTrackEnd();
      }
    }
  }, [status.currentTime, status.duration]);

  const handleTrackEnd = async () => {
    const { repeatMode, currentTrack } = stateRef.current;
    if (repeatMode === 'ONE' && currentTrack) {
      player.seekTo(0);
      player.play();
      hasTriggeredEndRef.current = false;
    } else {
      next();
    }
  };

  const playTrack = async (track: Track, queueList?: Track[]) => {
    let newQueue = queueList || stateRef.current.queue;
    if (queueList) {
      setOriginalQueue(queueList);
      if (stateRef.current.isShuffle) {
        newQueue = [...queueList].sort(() => Math.random() - 0.5);
      }
      setQueue(newQueue);
    }
    hasTriggeredEndRef.current = false;
    setCurrentTrack(track);
  };

  const pause = async () => {
    player.pause();
  };

  const resume = async () => {
    player.play();
  };

  const next = async () => {
    const { queue, currentTrack, repeatMode } = stateRef.current;
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    let nextIndex = currentIndex + 1;
    
    if (nextIndex >= queue.length) {
      if (repeatMode === 'ALL') {
        nextIndex = 0;
      } else {
        player.pause();
        return; // End of queue
      }
    }
    setCurrentTrack(queue[nextIndex]);
  };

  const previous = async () => {
    const { queue, currentTrack } = stateRef.current;
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    let prevIndex = currentIndex - 1;
    
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }
    setCurrentTrack(queue[prevIndex]);
  };

  const seek = async (positionMillis: number) => {
    player.seekTo(positionMillis / 1000);
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => {
      const newShuffle = !prev;
      if (newShuffle) {
        const shuffled = [...stateRef.current.originalQueue].sort(() => Math.random() - 0.5);
        setQueue(shuffled);
      } else {
        setQueue(stateRef.current.originalQueue);
      }
      return newShuffle;
    });
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'OFF') return 'ALL';
      if (prev === 'ALL') return 'ONE';
      return 'OFF';
    });
  };

  return (
    <PlayerContext.Provider value={{
      currentTrack, queue, isPlaying, position, duration, isShuffle, repeatMode,
      playTrack, pause, resume, next, previous, seek, toggleShuffle, toggleRepeat
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
