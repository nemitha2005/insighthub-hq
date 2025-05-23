'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { FileUpload } from '@/components/upload/file-upload';
import { Button } from '@/components/ui/button';
import { Loader2, File, FileText, Trash2, Database } from 'lucide-react';
import { uploadFile, deleteFile } from '@/services/storageService';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

export default function DataPage() {
  const { user, loading: authLoading } = useAuth();
  const { files, loading: filesLoading, refreshFiles } = useData();
  const router = useRouter();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleFileSelect = async (file: File) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to upload files',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      await uploadFile(file, user.uid, (progress) => {
        setUploadProgress(progress);
      });

      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });

      refreshFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      setDeletingFile(fileId);
      await deleteFile(fileId);

      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });

      refreshFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingFile(null);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('csv')) {
      return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />;
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />;
    } else {
      return <File className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 flex items-center">
          <Database className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
          Data Management
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground">Upload and manage your data files for analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-1">
          <div className="border border-border rounded-lg p-4 sm:p-6 bg-background/50 backdrop-blur-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Upload Data</h3>
            <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
              Upload your business data files to analyze with AI. We support CSV and Excel files.
            </p>

            <FileUpload
              onFileSelect={handleFileSelect}
              acceptedFileTypes=".csv,.xlsx,.xls"
              maxFileSizeMB={10}
              buttonText="Upload File"
            />

            {uploading && (
              <div className="mt-4">
                <div className="w-full bg-border rounded-full h-2 mb-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">Uploading... {uploadProgress.toFixed(0)}%</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="border border-border rounded-lg p-4 sm:p-6 bg-background/50 backdrop-blur-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Your Files</h3>

            {filesLoading ? (
              <div className="flex justify-center items-center py-8 sm:py-10">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-8 sm:py-10 border-2 border-dashed border-border rounded-lg bg-background/30">
                <File className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-base sm:text-lg font-medium mb-2">No files yet</h4>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base px-4">
                  Upload your first file to get started with data analysis
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-0">
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left pb-3 font-medium text-sm sm:text-base">File</th>
                        <th className="text-left pb-3 font-medium text-sm sm:text-base">Size</th>
                        <th className="text-left pb-3 font-medium text-sm sm:text-base">Uploaded</th>
                        <th className="text-right pb-3 font-medium text-sm sm:text-base">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((file) => (
                        <tr key={file.id} className="border-b border-border/50 hover:bg-background/80">
                          <td className="py-4">
                            <div className="flex items-center">
                              {getFileIcon(file.type)}
                              <span className="ml-2 font-medium text-sm sm:text-base">{file.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-muted-foreground text-sm sm:text-base">
                            {formatFileSize(file.size)}
                          </td>
                          <td className="py-4 text-muted-foreground text-sm sm:text-base">
                            {formatDistanceToNow(new Date(file.uploadDate), { addSuffix: true })}
                          </td>
                          <td className="py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              onClick={() => handleDeleteFile(file.id)}
                              disabled={deletingFile === file.id}
                            >
                              {deletingFile === file.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              <span className="sr-only">Delete</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="sm:hidden space-y-3">
                  {files.map((file) => (
                    <div key={file.id} className="border border-border rounded-lg p-4 bg-background/80">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getFileIcon(file.type)}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(file.uploadDate), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
                          onClick={() => handleDeleteFile(file.id)}
                          disabled={deletingFile === file.id}
                        >
                          {deletingFile === file.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
