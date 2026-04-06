import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Button } from 'react-native';
import { useLibrary } from '../context/LibraryContext';
import { Track } from '../data/mockData';
import { usePlayer } from '../context/PlayerContext';

export default function LibraryScreen() {
  const { likedSongs, playlists, createPlaylist } = useLibrary();
  const { playTrack } = usePlayer();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName);
      setNewPlaylistName('');
      setIsCreating(false);
    }
  };

  const renderTrackItem = ({ item }: { item: Track }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => playTrack(item, likedSongs)}
    >
      <Image source={{ uri: item.artwork }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.artist}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Library</Text>
      
      {isCreating ? (
        <View style={styles.createBox}>
          <TextInput 
            value={newPlaylistName}
            onChangeText={setNewPlaylistName}
            placeholder="Playlist name"
            placeholderTextColor="#b3b3b3"
            style={styles.input}
          />
          <View style={styles.actionRow}>
            <Button title="Cancel" onPress={() => setIsCreating(false)} color="#b3b3b3" />
            <Button title="Create" onPress={handleCreate} color="#1DB954" />
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.createBtn} onPress={() => setIsCreating(true)}>
          <Text style={styles.createBtnText}>+ Create Playlist</Text>
        </TouchableOpacity>
      )}

      {playlists.map(p => (
        <View key={p.id} style={styles.playlistRow}>
          <Text style={styles.playlistName}>{p.name}</Text>
          <Text style={styles.subtitle}>{p.tracks.length} tracks</Text>
        </View>
      ))}

      <Text style={styles.subHeader}>Liked Songs</Text>
      <FlatList
        data={likedSongs}
        keyExtractor={item => item.id}
        renderItem={renderTrackItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No liked songs yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 10, marginBottom: 20 },
  subHeader: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 20, marginBottom: 10 },
  createBtn: { paddingVertical: 12, backgroundColor: '#282828', borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  createBtnText: { color: '#fff', fontWeight: 'bold' },
  createBox: { backgroundColor: '#282828', padding: 16, borderRadius: 8, marginBottom: 20 },
  input: { backgroundColor: '#3e3e3e', color: '#fff', padding: 12, borderRadius: 4, marginBottom: 12 },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  playlistRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  playlistName: { color: '#fff', fontSize: 16, fontWeight: '500' },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  image: { width: 50, height: 50, borderRadius: 4 },
  info: { marginLeft: 12, flex: 1 },
  title: { color: '#fff', fontSize: 16, fontWeight: '500', marginBottom: 4 },
  subtitle: { color: '#b3b3b3', fontSize: 14 },
  listContent: { paddingBottom: 100 },
  emptyText: { color: '#b3b3b3', fontStyle: 'italic', marginTop: 10 },
});
