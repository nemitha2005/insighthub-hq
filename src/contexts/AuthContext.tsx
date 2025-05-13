'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { createOrUpdateUser } from '@/services/userService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();

            if (userData.photoURL && !authUser.photoURL) {
              await updateProfile(authUser, {
                photoURL: userData.photoURL,
              });
              setUser({ ...authUser, photoURL: userData.photoURL });
            } else {
              setUser(authUser);
            }

            console.log('User data from Firestore:', userData);
            console.log('Current user photo URL:', authUser.photoURL);
          } else {
            setUser(authUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(authUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createOrUpdateUser(userCredential.user, 'email');
      console.log('User document created after email signup');
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await createOrUpdateUser(userCredential.user, 'email');
      console.log('User document updated after email login');
    } catch (error) {
      console.error('Error during email sign in:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await createOrUpdateUser(userCredential.user, 'google');
      console.log('User document created/updated after Google login');
      console.log('Google profile photo URL:', userCredential.user.photoURL);
    } catch (error) {
      console.error('Error during Google sign in:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, logout }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
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
