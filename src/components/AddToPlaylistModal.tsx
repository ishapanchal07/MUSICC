import React from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity, Button } from 'react-native';
import { useLibrary } from '../context/LibraryContext';
import { Track } from '../data/mockData';

interface Props {
  visible: boolean;
  onClose: () => void;
  track: Track | null;
}

export default function AddToPlaylistModal({ visible, onClose, track }: Props) {
  const { playlists, addToPlaylist } = useLibrary();

  if (!track) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.bg}>
        <View style={styles.content}>
          <Text style={styles.title}>Add "{track.title}" to Playlist</Text>
          <FlatList
            data={playlists}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  addToPlaylist(item.id, track);
                  onClose();
                }}
              >
                <Text style={styles.name}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No playlists created yet.</Text>}
          />
          <View style={styles.closeBtn}>
            <Button title="Cancel" onPress={onClose} color="#888" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  content: { backgroundColor: '#121212', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, maxHeight: '60%' },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  row: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#282828' },
  name: { color: '#fff', fontSize: 16 },
  empty: { color: '#888', fontStyle: 'italic', marginBottom: 20, textAlign: 'center' },
  closeBtn: { marginTop: 10 }
});
