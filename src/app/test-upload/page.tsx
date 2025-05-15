'use client';

import { FileUpload } from '@/components/upload/file-upload';

export default function TestUploadPage() {
  const handleFileSelect = (file: File) => {
    console.log('Selected file:', file);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test File Upload</h1>
      <div className="max-w-md">
        <FileUpload onFileSelect={handleFileSelect} acceptedFileTypes=".csv,.xlsx,.xls" maxFileSizeMB={5} />
      </div>
    </div>
  );
}
