'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/upload/file-upload';
import { Button } from '@/components/ui/button';
import { uploadFile, getUserFiles, deleteFile, FileData } from '@/services/storageService';
import { useAuth } from '@/contexts/AuthContext';

export default function TestStoragePage() {
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!user) {
      alert('You must be logged in to upload files');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      await uploadFile(file, user.uid, (progress) => {
        setUploadProgress(progress);
      });

      alert('File uploaded successfully!');
      fetchFiles();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const fetchFiles = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userFiles = await getUserFiles(user.uid);
      setFiles(userFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      alert('Error fetching files');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteFile(fileId);
      alert('File deleted successfully');
      fetchFiles();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting file');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Storage Service</h1>

      {!user && <p className="text-red-500 mb-4">You must be logged in to use this feature</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Upload File</h2>
          <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes=".csv,.xlsx,.xls" />

          {uploading && (
            <div className="mt-4">
              <div className="w-full bg-border rounded-full h-2 mb-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
              <p className="text-sm">Uploading: {uploadProgress.toFixed(0)}%</p>
            </div>
          )}
        </div>

        <div className="border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your Files</h2>
          <Button onClick={fetchFiles} disabled={loading} className="mb-4">
            {loading ? 'Loading...' : 'Refresh Files'}
          </Button>

          {files.length === 0 ? (
            <p>No files found</p>
          ) : (
            <ul className="space-y-2">
              {files.map((file) => (
                <li key={file.id} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p>{file.name}</p>
                      <p className="text-sm text-muted-foreground">{new Date(file.uploadDate).toLocaleString()}</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteFile(file.id)}>
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
