'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FileData } from '@/services/storageService';
import { DataSummary } from '@/services/analysisService';

interface AnalysisData {
  columns: string[];
  records: Record<string, any>[];
  summary: DataSummary;
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

// Create a default summary that matches the DataSummary type
const defaultSummary: DataSummary = {
  rowCount: 0,
  columnCount: 0,
  columnSummaries: {},
};

const initialAnalysisData: AnalysisData = {
  columns: [],
  records: [],
  summary: defaultSummary,
  isLoading: false,
  error: null,
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);
  const [analysisData, setAnalysisDataState] = useState<AnalysisData>(initialAnalysisData);

  // Use useCallback to prevent recreation on every render
  const setAnalysisData = useCallback((data: Partial<AnalysisData>) => {
    setAnalysisDataState((prev) => ({ ...prev, ...data }));
  }, []);

  // Use useCallback for resetAnalysis too
  const resetAnalysis = useCallback(() => {
    setCurrentFile(null);
    setAnalysisDataState(initialAnalysisData);
  }, []);

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
