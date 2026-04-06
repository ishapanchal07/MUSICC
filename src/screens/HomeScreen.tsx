import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Button } from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import { Track } from '../data/mockData';
import { useLibrary } from '../context/LibraryContext';
import { Ionicons } from '@expo/vector-icons';
import AddToPlaylistModal from '../components/AddToPlaylistModal';

export default function HomeScreen() {
  const { playTrack, currentTrack } = usePlayer();
  const { localSongs, loadLocalMusic } = useLibrary();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  useEffect(() => {
    loadLocalMusic();
  }, []);

  const renderItem = ({ item }: { item: Track }) => {
    const isPlaying = currentTrack?.id === item.id;
    return (
      <TouchableOpacity 
        style={styles.trackItem} 
        onPress={() => playTrack(item, localSongs)}
      >
        <Image source={{ uri: item.artwork }} style={styles.artwork} />
        <View style={styles.trackInfo}>
          <Text style={[styles.title, isPlaying && styles.playingTitle]} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
        </View>
        <Text style={styles.duration}>
          {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
        </Text>
        <TouchableOpacity onPress={() => setSelectedTrack(item)} style={styles.addBtn}>
          <Ionicons name="add-circle-outline" size={24} color="#1DB954" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Good evening</Text>
      <FlatList
        data={localSongs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No local songs found.</Text>
            <Button title="Load Local Music" onPress={loadLocalMusic} color="#1DB954" />
          </View>
        }
      />
      <AddToPlaylistModal visible={!!selectedTrack} track={selectedTrack} onClose={() => setSelectedTrack(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 100, // Make room for MiniPlayer
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  artwork: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  trackInfo: {
    marginLeft: 16,
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  playingTitle: {
    color: '#1DB954',
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  duration: {
    color: '#b3b3b3',
    fontSize: 14,
    marginLeft: 'auto',
  },
  addBtn: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: '#b3b3b3',
    marginBottom: 20,
  },
});
