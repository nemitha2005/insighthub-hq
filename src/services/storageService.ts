import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, setDoc, collection, query, where, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';

export interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: any;
  url: string;
  path: string;
  userId: string;
}

export async function uploadFile(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void,
): Promise<FileData> {
  try {
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    const filePath = `users/${userId}/data/${fileName}`;
    const storageRef = ref(storage, filePath);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const fileData: FileData = {
              id: fileId,
              name: file.name,
              type: file.type,
              size: file.size,
              uploadDate: serverTimestamp(),
              url: downloadURL,
              path: filePath,
              userId: userId,
            };

            await setDoc(doc(db, 'files', fileId), fileData);

            resolve({
              ...fileData,
              uploadDate: new Date(),
            });
          } catch (error) {
            console.error('Error saving file data:', error);
            reject(error);
          }
        },
      );
    });
  } catch (error) {
    console.error('Error preparing upload:', error);
    throw error;
  }
}

export async function getUserFiles(userId: string): Promise<FileData[]> {
  try {
    const q = query(collection(db, 'files'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const files: FileData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FileData;
      files.push({
        ...data,
        uploadDate: data.uploadDate?.toDate ? data.uploadDate.toDate() : new Date(),
      });
    });

    return files;
  } catch (error) {
    console.error('Error getting user files:', error);
    throw error;
  }
}

export async function deleteFile(fileId: string): Promise<void> {
  try {
    const filesRef = collection(db, 'files');
    const q = query(filesRef, where('id', '==', fileId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('File not found');
    }

    const fileData = querySnapshot.docs[0].data() as FileData;

    const fileRef = ref(storage, fileData.path);
    await deleteObject(fileRef);

    await deleteDoc(doc(db, 'files', fileId));
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}
