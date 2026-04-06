import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePlayer } from '../context/PlayerContext';
import { useLibrary } from '../context/LibraryContext';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

export default function PlayerScreen() {
  const navigation = useNavigation();
  const { 
    currentTrack, isPlaying, position, duration, isShuffle, repeatMode,
    pause, resume, seek, next, previous, toggleShuffle, toggleRepeat 
  } = usePlayer();
  const { isLiked, toggleLike } = useLibrary();

  if (!currentTrack) return null;

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const repeatIconColor = repeatMode !== 'OFF' ? '#1DB954' : '#fff';
  const repeatIconName = repeatMode === 'ONE' ? 'repeat-outline' : 'repeat';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-down" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <View style={styles.headerBtn} />
      </View>

      <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />

      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleLike(currentTrack)}>
          <Ionicons 
            name={isLiked(currentTrack.id) ? 'heart' : 'heart-outline'} 
            size={28} 
            color={isLiked(currentTrack.id) ? '#1DB954' : '#fff'} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="#535353"
          thumbTintColor="#fff"
          onSlidingComplete={seek}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlBtn} onPress={toggleShuffle}>
          <Ionicons name="shuffle" size={30} color={isShuffle ? '#1DB954' : '#fff'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={previous}>
          <Ionicons name="play-skip-back" size={40} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playBtn} onPress={isPlaying ? pause : resume}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={48} color="#000" style={{ marginLeft: isPlaying ? 0 : 4 }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={next}>
          <Ionicons name="play-skip-forward" size={40} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={toggleRepeat}>
          <Ionicons name={repeatIconName} size={30} color={repeatIconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, marginTop: 20 },
  headerBtn: { width: 40, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  artwork: { width: width - 48, height: width - 48, borderRadius: 8, marginBottom: 40 },
  infoContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  textContainer: { flex: 1, marginRight: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  artist: { color: '#b3b3b3', fontSize: 18 },
  progressContainer: { marginBottom: 30 },
  slider: { width: '100%', height: 40 },
  timeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -10, paddingHorizontal: 15 },
  timeText: { color: '#b3b3b3', fontSize: 12 },
  controlsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  controlBtn: { padding: 10 },
  playBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#1DB954', justifyContent: 'center', alignItems: 'center' },
});
