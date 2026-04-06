import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import { MOCK_TRACKS, Track } from '../data/mockData';

export default function HomeScreen() {
  const { playTrack, currentTrack } = usePlayer();

  const renderItem = ({ item }: { item: Track }) => {
    const isPlaying = currentTrack?.id === item.id;
    return (
      <TouchableOpacity 
        style={styles.trackItem} 
        onPress={() => playTrack(item, MOCK_TRACKS)}
      >
        <Image source={{ uri: item.artwork }} style={styles.artwork} />
        <View style={styles.trackInfo}>
          <Text style={[styles.title, isPlaying && styles.playingTitle]}>{item.title}</Text>
          <Text style={styles.artist}>{item.artist}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Good evening</Text>
      <FlatList
        data={MOCK_TRACKS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
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
});
