'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserFiles, FileData } from '@/services/storageService';

type DataContextType = {
  files: FileData[];
  loading: boolean;
  error: string | null;
  refreshFiles: () => Promise<void>;
  selectedFile: FileData | null;
  setSelectedFile: (file: FileData | null) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);

  useEffect(() => {
    if (user) {
      refreshFiles();
    } else {
      setFiles([]);
      setLoading(false);
    }
  }, [user]);

  const refreshFiles = async () => {
    if (!user) {
      setFiles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userFiles = await getUserFiles(user.uid);

      userFiles.sort((a, b) => {
        const dateA = a.uploadDate instanceof Date ? a.uploadDate : new Date(a.uploadDate);
        const dateB = b.uploadDate instanceof Date ? b.uploadDate : new Date(b.uploadDate);
        return dateB.getTime() - dateA.getTime();
      });

      setFiles(userFiles);
    } catch (err) {
      console.error('Error loading files:', err);
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        files,
        loading,
        error,
        refreshFiles,
        selectedFile,
        setSelectedFile,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
