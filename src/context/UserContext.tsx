import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  name: string;
  profileImage: string | null;
}

interface UserContextType {
  user: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

export const UserProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>({ name: 'Music Lover', profileImage: null });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await AsyncStorage.getItem('@user_profile');
      if (data) setUser(JSON.parse(data));
    } catch (e) {
      console.error(e);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const newUser = { ...user, ...updates };
      setUser(newUser);
      await AsyncStorage.setItem('@user_profile', JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <UserContext.Provider value={{ user, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};
