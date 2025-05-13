import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from 'firebase/auth';

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  authProvider: string;
  createdAt: any;
  lastLogin: any;
}

export async function createOrUpdateUser(user: User, authProvider: string = 'email'): Promise<void> {
  if (!user.uid) return;

  console.log('Creating/updating user with photo URL:', user.photoURL);

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  const timestamp = serverTimestamp();

  if (!userSnap.exists()) {
    const userData: UserData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      authProvider,
      createdAt: timestamp,
      lastLogin: timestamp,
    };

    await setDoc(userRef, userData);
    console.log('New user document created in Firestore with data:', userData);
  } else {
    const updateData = {
      lastLogin: timestamp,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
    };

    await setDoc(userRef, updateData, { merge: true });
    console.log('User document updated in Firestore with data:', updateData);
  }
}
