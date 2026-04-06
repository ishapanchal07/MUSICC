import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import PlayerScreen from '../screens/PlayerScreen';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayer } from '../context/PlayerContext';
import PlaylistScreen from '../screens/PlaylistScreen';

export type RootStackParamList = {
  Main: undefined;
  Player: undefined;
  Playlist: { playlistId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#121212',
    card: '#282828',
    text: '#FFFFFF',
    border: '#282828',
  },
};

export default function AppNavigator() {
  const { currentTrack } = usePlayer();

  return (
    <NavigationContainer theme={MyTheme}>
      <View style={styles.container}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen 
            name="Playlist" 
            component={PlaylistScreen} 
            options={{ animation: 'slide_from_right' }} 
          />
          <Stack.Screen 
            name="Player" 
            component={PlayerScreen} 
            options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} 
          />
        </Stack.Navigator>
        {currentTrack && <MiniPlayer />}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
