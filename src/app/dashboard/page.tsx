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
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Your Dashboard</h2>
        <p className="text-lg text-muted-foreground">
          View insights, analyze data and create reports with AI-powered business intelligence
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <DashboardCard title="Analytics Overview" className="h-full" featured={true}>
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6">
              <TrendingUp className="h-16 w-16 text-muted-foreground mb-6" />
              <h3 className="text-xl font-medium mb-4">No data to analyze yet</h3>
              <p className="text-muted-foreground mb-8">
                Upload your business data or connect a data source to get started with AI-powered insights.
              </p>
              <div className="flex gap-4">
                <Button variant="secondary" size="lg">
                  Upload Data
                </Button>
                <Button variant="outline" size="lg">
                  Connect Source
                </Button>
              </div>
            </div>
          </DashboardCard>
        </div>
        <div className="space-y-8">
          <DashboardCard title="Quick Actions">
            <div className="space-y-4 p-2">
              <Button variant="secondary" className="w-full justify-start h-12">
                <UploadCloud className="mr-2 h-5 w-5" /> Upload Data
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <LinkIcon className="mr-2 h-5 w-5" /> Connect Data Source
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Report
              </Button>
            </div>
          </DashboardCard>

          <DashboardCard title="Recent Reports">
            <div className="text-center text-muted-foreground py-10">
              <p className="mb-2">No recent reports.</p>
              <p>Create your first report to see it here.</p>
            </div>
          </DashboardCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
