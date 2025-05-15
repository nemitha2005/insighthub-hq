import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, X, FileText, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  acceptedFileTypes?: string;
  maxFileSizeMB?: number;
  onFileSelect: (file: File) => void;
  className?: string;
  buttonText?: string;
}

export function FileUpload({
  acceptedFileTypes = '.csv,.xlsx,.xls',
  maxFileSizeMB = 10,
  onFileSelect,
  className,
  buttonText = 'Select File',
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxFileSizeMB * 1024 * 1024;

  const validateFile = (file: File): boolean => {
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxFileSizeMB}MB limit`);
      return false;
    }

    const fileType = file.name.split('.').pop()?.toLowerCase() || '';
    const acceptedTypes = acceptedFileTypes.split(',').map((type) => type.replace('.', '').trim().toLowerCase());

    if (!acceptedTypes.includes(fileType)) {
      setError(`File type .${fileType} is not supported`);
      return false;
    }

    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      setSelectedFile(file);
      setError(null);
      onFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      setSelectedFile(file);
      setError(null);
      onFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const openFileSelector = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return null;

    const extension = selectedFile.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
      return <FileText className="h-8 w-8 text-blue-400" />;
    } else if (['xlsx', 'xls'].includes(extension || '')) {
      return <FileText className="h-8 w-8 text-green-400" />;
    } else {
      return <File className="h-8 w-8 text-muted-foreground" />;
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {!selectedFile ? (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer hover:border-muted-foreground/50',
            dragActive ? 'border-ring bg-background/50' : 'border-border',
            error && 'border-red-500',
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileSelector}
        >
          <input type="file" ref={inputRef} onChange={handleFileChange} accept={acceptedFileTypes} className="hidden" />
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-medium mt-2">Drag and drop your file here or</h3>
            <Button
              variant="secondary"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openFileSelector();
              }}
            >
              {buttonText}
            </Button>
            <p className="text-sm text-muted-foreground">Supported formats: {acceptedFileTypes.replace(/\./g, '')}</p>
            <p className="text-sm text-muted-foreground">Maximum file size: {maxFileSizeMB}MB</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-background/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon()}
              <div>
                <p className="text-sm font-medium truncate max-w-[240px]">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={removeFile} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
