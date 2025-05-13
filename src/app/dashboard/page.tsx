'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { UploadCloud, Link as LinkIcon, PlusCircle, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your business data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <DashboardCard title="Analytics Overview" className="h-full">
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-4">
              <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No data to analyze yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload your business data or connect a data source to get started with AI-powered insights.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary">Upload Data</Button>
                <Button variant="outline">Connect Source</Button>
              </div>
            </div>
          </DashboardCard>
        </div>
        <div className="space-y-6">
          <DashboardCard title="Quick Actions">
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start">
                <UploadCloud className="mr-2 h-4 w-4" /> Upload Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <LinkIcon className="mr-2 h-4 w-4" /> Connect Data Source
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Report
              </Button>
            </div>
          </DashboardCard>

          <DashboardCard title="Recent Reports">
            <p className="text-center text-muted-foreground py-6">
              No recent reports. Create your first report to see it here.
            </p>
          </DashboardCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
