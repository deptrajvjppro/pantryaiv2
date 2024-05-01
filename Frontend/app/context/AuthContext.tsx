import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from "expo-router";
interface User {
  id: number | null; // The id is a number within your app
}


interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
 
  // Function to load user from secure storage and convert to a number
  const loadUser = async () => {
    const userIdString = await SecureStore.getItemAsync('userId');
    if (userIdString) {
      const userId = parseInt(userIdString, 10);
      if (!isNaN(userId)) {
        setUser({ id: userId });
      }
    }
    setIsLoaded(true);
  };


  // Handle user login and save the id as a string in SecureStore
  const login = async (email: string, password: string) => {
    const response = await fetch('http://192.168.1.15:5000/backend/loginUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (response.ok) {
      const userId = result.user_id;
      await SecureStore.setItemAsync('userId', String(userId));
      setUser({ id: userId });
 
    } else {
      throw new Error(result.error || 'Login failed');
    }
  };


  // Handle user logout
  const logout = async () => {
    await SecureStore.deleteItemAsync('userId');
    setUser(null);
  };


  useEffect(() => {
    loadUser();
  }, []);


  return (
    <AuthContext.Provider value={{ user, isLoaded, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};





