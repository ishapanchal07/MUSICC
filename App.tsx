import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './src/context/UserContext';
import { PlayerProvider } from './src/context/PlayerContext';
import { LibraryProvider } from './src/context/LibraryContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <LibraryProvider>
          <PlayerProvider>
            <StatusBar style="light" />
            <AppNavigator />
          </PlayerProvider>
        </LibraryProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
