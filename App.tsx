import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './src/context/UserContext';
import { PlayerProvider } from './src/context/PlayerContext';
import { LibraryProvider } from './src/context/LibraryContext';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <LibraryProvider>
          <PlayerProvider>
            <AuthProvider>
              <StatusBar style="light" />
              <AppNavigator />
            </AuthProvider>
          </PlayerProvider>
        </LibraryProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
