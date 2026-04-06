import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { usePlayer } from '../context/PlayerContext';
import { useLibrary } from '../context/LibraryContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export default function MiniPlayer() {
  const { currentTrack, isPlaying, pause, resume } = usePlayer();
  const { toggleLike, isLiked } = useLibrary();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (!currentTrack) return null;

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.9} 
      onPress={() => navigation.navigate('Player')}
    >
      <View style={styles.left}>
        <Image source={{ uri: currentTrack.artwork }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => toggleLike(currentTrack)}>
          <Ionicons 
            name={isLiked(currentTrack.id) ? 'heart' : 'heart-outline'} 
            size={24} 
            color={isLiked(currentTrack.id) ? '#1DB954' : '#fff'} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={isPlaying ? pause : resume}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333333',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 8,
    position: 'absolute',
    bottom: 55, // Offset for the bottom tab bar
    left: 0,
    right: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: -2 },
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 8,
  },
});
