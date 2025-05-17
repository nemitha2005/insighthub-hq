'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { FileAnalysisPage } from '@/components/dashboard/file-analysis-page';
import { Loader2, FileText, Table, Database, BarChart3, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { FileData } from '@/services/storageService';

export default function AnalyzePage() {
  const { user, loading: authLoading } = useAuth();
  const { files, loading: filesLoading, refreshFiles } = useData();
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && !authLoading) {
      refreshFiles();
    }
  }, [user, authLoading]);

  if (authLoading || filesLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-sm sm:text-base">Loading files...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('csv')) {
      return <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-blue-400" />;
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-green-400" />;
    } else {
      return <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout>
      {selectedFile ? (
        <FileAnalysisPage file={selectedFile} onBack={() => setSelectedFile(null)} />
      ) : (
        <>
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              Analyze Data
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Select a file to analyze and visualize your business data
            </p>
          </div>

          {files.length === 0 ? (
            <div className="text-center rounded-lg border-2 border-dashed border-border p-8 sm:p-12 bg-background/30">
              <Database className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 text-muted-foreground" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No files found</h3>
              <p className="text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                You need to upload some data files before you can analyze them. Upload CSV or Excel files to get
                started.
              </p>
              <Button variant="secondary" onClick={() => router.push('/dashboard/data')} className="w-full sm:w-auto">
                Upload Files
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="border border-border rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-ring/30 shadow-sm relative cursor-pointer hover:shadow-md"
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="border-b border-border p-3 sm:p-5 bg-background/80">
                    <h3 className="text-base sm:text-xl font-semibold">Data File</h3>
                  </div>
                  <div className="p-3 sm:p-5">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm sm:text-lg font-medium mb-1 truncate">{file.name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                            {formatFileSize(file.size)} • Uploaded{' '}
                            {formatDistanceToNow(new Date(file.uploadDate), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(file);
                        }}
                      >
                        <span className="flex items-center">
                          <Table className="h-4 w-4 mr-2" />
                          Analyze
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
