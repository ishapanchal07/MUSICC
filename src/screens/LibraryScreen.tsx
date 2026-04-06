import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Button, Modal } from 'react-native';
import { useLibrary } from '../context/LibraryContext';
import { Track } from '../data/mockData';
import { usePlayer } from '../context/PlayerContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function LibraryScreen() {
  const { likedSongs, playlists, createPlaylist } = useLibrary();
  const { playTrack } = usePlayer();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
      
      <TouchableOpacity style={styles.createBtn} onPress={() => setIsCreating(true)}>
        <Text style={styles.createBtnText}>+ Create Playlist</Text>
      </TouchableOpacity>

      {playlists.map(p => (
        <TouchableOpacity key={p.id} style={styles.playlistRow} onPress={() => navigation.navigate('Playlist', { playlistId: p.id })}>
          <Text style={styles.playlistName}>{p.name}</Text>
          <Text style={styles.subtitle}>{p.tracks.length} tracks</Text>
        </TouchableOpacity>
      ))}

      <Modal visible={isCreating} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Playlist</Text>
            <TextInput 
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              placeholder="Playlist name"
              placeholderTextColor="#888"
              style={styles.modalInput}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setIsCreating(false)} color="#888" />
              <Button title="Create" onPress={handleCreate} color="#1DB954" />
            </View>
          </View>
        </View>
      </Modal>

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
  playlistRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  playlistName: { color: '#fff', fontSize: 16, fontWeight: '500' },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  image: { width: 50, height: 50, borderRadius: 4 },
  info: { marginLeft: 12, flex: 1 },
  title: { color: '#fff', fontSize: 16, fontWeight: '500', marginBottom: 4 },
  subtitle: { color: '#b3b3b3', fontSize: 14 },
  listContent: { paddingBottom: 100 },
  emptyText: { color: '#b3b3b3', fontStyle: 'italic', marginTop: 10 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#282828', padding: 20, borderRadius: 8 },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  modalInput: { backgroundColor: '#121212', color: '#fff', padding: 12, borderRadius: 4, marginBottom: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }
});
