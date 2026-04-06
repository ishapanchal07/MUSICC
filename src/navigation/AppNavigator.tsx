import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import PlayerScreen from '../screens/PlayerScreen';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayer } from '../context/PlayerContext';
import PlaylistScreen from '../screens/PlaylistScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import { useAuth } from '../context/AuthContext';

export type RootStackParamList = {
  Main: undefined;
  Player: undefined;
  Playlist: { playlistId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

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
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={MyTheme}>
      <View style={styles.container}>
        {session ? (
          <>
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
          </>
        ) : (
          <AuthStack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#121212' } }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Signup" component={SignupScreen} />
          </AuthStack.Navigator>
        )}
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
