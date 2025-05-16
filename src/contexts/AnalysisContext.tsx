'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { FileData } from '@/services/storageService';

interface AnalysisData {
  columns: string[];
  records: Record<string, any>[];
  summary: Record<string, any>;
  isLoading: boolean;
  error: string | null;
}

interface AnalysisContextType {
  currentFile: FileData | null;
  analysisData: AnalysisData;
  setCurrentFile: (file: FileData | null) => void;
  setAnalysisData: (data: Partial<AnalysisData>) => void;
  resetAnalysis: () => void;
}

const initialAnalysisData: AnalysisData = {
  columns: [],
  records: [],
  summary: {},
  isLoading: false,
  error: null,
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);
  const [analysisData, setAnalysisDataState] = useState<AnalysisData>(initialAnalysisData);

  const setAnalysisData = (data: Partial<AnalysisData>) => {
    setAnalysisDataState((prev) => ({ ...prev, ...data }));
  };

  const resetAnalysis = () => {
    setCurrentFile(null);
    setAnalysisDataState(initialAnalysisData);
  };

  return (
    <AnalysisContext.Provider
      value={{
        currentFile,
        analysisData,
        setCurrentFile,
        setAnalysisData,
        resetAnalysis,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
