'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // This will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center border-b border-border pb-4 mb-8">
          <h1 className="text-3xl font-bold">InsightHub Dashboard</h1>
          <div className="flex items-center space-x-4">
            <p className="text-muted-foreground">Welcome, {user.displayName || user.email}</p>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 border border-border rounded-lg p-6 bg-background/50">
            <h2 className="text-xl font-semibold mb-4">Your Analytics Dashboard</h2>
            <p className="text-muted-foreground">
              This is where your data visualizations and analytics will appear. To get started, upload some data or
              connect to a data source.
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 bg-background/50">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full">
                Upload Data
              </Button>
              <Button variant="outline" className="w-full">
                Connect Data Source
              </Button>
              <Button variant="outline" className="w-full">
                Create New Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
