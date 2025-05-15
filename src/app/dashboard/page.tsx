'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import { UploadCloud, Link as LinkIcon, PlusCircle, TrendingUp, FileText, Database } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { files, loading: filesLoading, refreshFiles } = useData();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const recentFiles = files.slice(0, 3);

  if (authLoading) {
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
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/dashboard/data">Upload Data</Link>
                </Button>
                <Button variant="outline" size="lg" disabled>
                  Connect Source
                </Button>
              </div>
            </div>
          </DashboardCard>
        </div>
        <div className="space-y-8">
          <DashboardCard title="Quick Actions">
            <div className="space-y-4 p-2">
              <Button variant="secondary" className="w-full justify-start h-12" asChild>
                <Link href="/dashboard/data">
                  <UploadCloud className="mr-2 h-5 w-5" /> Upload Data
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start h-12" disabled>
                <LinkIcon className="mr-2 h-5 w-5" /> Connect Data Source
              </Button>
              <Button variant="outline" className="w-full justify-start h-12" disabled>
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Report
              </Button>
            </div>
          </DashboardCard>

          <DashboardCard title="Recent Files">
            <div className="p-2">
              {filesLoading ? (
                <div className="text-center py-4 text-muted-foreground">Loading files...</div>
              ) : recentFiles.length === 0 ? (
                <div className="text-center text-muted-foreground py-6">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="mb-2">No files uploaded yet.</p>
                  <p className="mb-4">Upload your first file to see it here.</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/data">
                      <Database className="mr-2 h-4 w-4" /> Go to Data Management
                    </Link>
                  </Button>
                </div>
              ) : (
                <>
                  <ul className="space-y-3">
                    {recentFiles.map((file) => (
                      <li key={file.id} className="border-b pb-2 last:border-0">
                        <div className="flex items-start">
                          <FileText className="h-4 w-4 mt-1 mr-2 text-blue-400" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(file.uploadDate), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-2 border-t">
                    <Button variant="ghost" size="sm" className="w-full" asChild>
                      <Link href="/dashboard/data">
                        <Database className="mr-2 h-4 w-4" /> View All Files
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DashboardCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
