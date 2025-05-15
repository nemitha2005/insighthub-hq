'use client';

import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function TestDataContextPage() {
  const { user } = useAuth();
  const { files, loading, error, refreshFiles } = useData();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Data Context</h1>

      {!user && <p className="text-red-500 mb-4">Please log in to test the data context</p>}

      <div className="mb-4">
        <Button onClick={refreshFiles} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Refresh Files
        </Button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Your Files from Context</h2>
        {loading ? (
          <div className="flex items-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Loading files...</span>
          </div>
        ) : files.length === 0 ? (
          <p>No files found</p>
        ) : (
          <ul className="space-y-2">
            {files.map((file) => (
              <li key={file.id} className="border-b pb-2">
                <p>{file.name}</p>
                <p className="text-sm text-muted-foreground">Uploaded: {new Date(file.uploadDate).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
