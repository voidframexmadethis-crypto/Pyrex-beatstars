import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  youtubeToken: string | null;
  signInForYouTube: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [youtubeToken, setYoutubeToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser ? `User logged in: ${currentUser.email}` : 'User logged out');
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) setYoutubeToken(null);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error?.code?.includes('popup')) return;
      console.error('Error signing in:', error);
    }
  };

  const signInForYouTube = async (): Promise<string | null> => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/youtube.upload');
    provider.setCustomParameters({ prompt: 'consent select_account' });
    
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setYoutubeToken(credential.accessToken);
        return credential.accessToken;
      }
    } catch (error: any) {
      if (error?.code?.includes('popup')) return null;
      console.error('Error signing in for YouTube:', error);
    }
    return null;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logout, youtubeToken, signInForYouTube }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
