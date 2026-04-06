import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput, Button } from 'react-native';
import { useUser } from '../context/UserContext';
import { useLibrary } from '../context/LibraryContext';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, updateProfile } = useUser();
  const { localSongs, playlists, likedSongs } = useLibrary();
  
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user.name);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateProfile({ profileImage: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    updateProfile({ name: editName });
    setIsEditModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      
      <View style={styles.profileHeader}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: user.profileImage || 'https://images.unsplash.com/photo-151136746198b-94fa915dbd28?q=80&w=100' }} 
            style={styles.profileImage} 
          />
          <TouchableOpacity style={styles.editImageBtn} onPress={handlePickImage}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <TouchableOpacity style={styles.editBtn} onPress={() => {
          setEditName(user.name);
          setIsEditModalVisible(true);
        }}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{localSongs.length}</Text>
          <Text style={styles.statLabel}>Local Songs</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{playlists.length}</Text>
          <Text style={styles.statLabel}>Playlists</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{likedSongs.length}</Text>
          <Text style={styles.statLabel}>Liked Songs</Text>
        </View>
      </View>

      <Modal visible={isEditModalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Name</Text>
            <TextInput 
              value={editName}
              onChangeText={setEditName}
              style={styles.input}
              placeholderTextColor="#888"
              placeholder="Your name"
            />
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setIsEditModalVisible(false)} color="#888" />
              <Button title="Save" onPress={handleSave} color="#1DB954" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 10, marginBottom: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 40 },
  imageContainer: { position: 'relative', marginBottom: 16 },
  profileImage: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#282828' },
  editImageBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1DB954', padding: 10, borderRadius: 20 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  editBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderColor: '#fff', borderWidth: 1 },
  editBtnText: { color: '#fff', fontWeight: '600' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#282828', borderRadius: 12, paddingVertical: 20 },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#1DB954', marginBottom: 4 },
  statLabel: { fontSize: 14, color: '#b3b3b3' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#282828', padding: 20, borderRadius: 8 },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { backgroundColor: '#121212', color: '#fff', padding: 12, borderRadius: 4, marginBottom: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }
});
