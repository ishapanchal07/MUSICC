import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, TextInput, Button } from 'react-native';
import { useLibrary } from '../context/LibraryContext';
import { usePlayer } from '../context/PlayerContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Playlist'>;

export default function PlaylistScreen({ route, navigation }: Props) {
  const { playlistId } = route.params;
  const { playlists, renamePlaylist, deletePlaylist, removeFromPlaylist } = useLibrary();
  const { playTrack } = usePlayer();
  
  const playlist = playlists.find(p => p.id === playlistId);
  const [isRenameModalVisible, setRenameModalVisible] = useState(false);
  const [newName, setNewName] = useState(playlist?.name || '');

  if (!playlist) return null;

  const handleRename = () => {
    if (newName.trim()) {
      renamePlaylist(playlist.id, newName);
      setRenameModalVisible(false);
    }
  };

  const handleDelete = () => {
    deletePlaylist(playlist.id);
    navigation.goBack();
  };

  const renderTrackItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item} onPress={() => playTrack(item, playlist.tracks)}>
      <Image source={{ uri: item.artwork }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{item.artist}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromPlaylist(playlist.id, item.id)} style={styles.actionBtn}>
        <Ionicons name="trash-outline" size={24} color="#ff4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.header} numberOfLines={1}>{playlist.name}</Text>
      </View>
      
      <View style={styles.actions}>
        <Button title="Rename" onPress={() => setRenameModalVisible(true)} color="#1DB954" />
        <Button title="Delete" onPress={handleDelete} color="#ff4444" />
      </View>

      <FlatList
        data={playlist.tracks}
        keyExtractor={item => item.id}
        renderItem={renderTrackItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Playlist is empty.</Text>}
      />

      <Modal visible={isRenameModalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Playlist</Text>
            <TextInput 
              value={newName} onChangeText={setNewName}
              style={styles.modalInput} placeholderTextColor="#888" placeholder="New name"
            />
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setRenameModalVisible(false)} color="#888" />
              <Button title="Save" onPress={handleRename} color="#1DB954" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 20 },
  backBtn: { marginRight: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#fff', flex: 1 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  listContent: { paddingBottom: 100 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  image: { width: 50, height: 50, borderRadius: 4 },
  info: { marginLeft: 12, flex: 1, marginRight: 10 },
  title: { color: '#fff', fontSize: 16, fontWeight: '500', marginBottom: 4 },
  subtitle: { color: '#b3b3b3', fontSize: 14 },
  actionBtn: { padding: 8 },
  emptyText: { color: '#b3b3b3', fontStyle: 'italic', marginTop: 10, textAlign: 'center' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#282828', padding: 20, borderRadius: 8 },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  modalInput: { backgroundColor: '#121212', color: '#fff', padding: 12, borderRadius: 4, marginBottom: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }
});
