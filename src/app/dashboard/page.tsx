'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DashboardCard } from '@/components/dashboard/dashboard-card';
import {
  UploadCloud,
  Link as LinkIcon,
  PlusCircle,
  TrendingUp,
  FileText,
  Database,
  BarChart3,
  MessageCircle,
  Brain,
  FileSearch,
  Globe,
  Clock,
  Lock,
  Sparkles,
  Settings,
  Zap,
} from 'lucide-react';
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
  const totalDataPoints = files.reduce((acc, file) => acc + file.size / 1024, 0);

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
      <div className="space-y-8 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Your Dashboard</h2>
          <p className="text-lg text-muted-foreground">
            View insights, analyze data and create reports with AI-powered business intelligence
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-background/50 rounded-lg border border-border">
            <Database className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold">{files.length}</p>
            <p className="text-sm text-muted-foreground">Total Files</p>
          </div>

          <div className="text-center p-6 bg-background/50 rounded-lg border border-border">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold">{totalDataPoints.toFixed(0)}KB</p>
            <p className="text-sm text-muted-foreground">Data Processed</p>
          </div>

          <div className="text-center p-6 bg-background/50 rounded-lg border border-border">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold">∞</p>
            <p className="text-sm text-muted-foreground">AI Queries Available</p>
          </div>

          <div className="text-center p-6 bg-background/50 rounded-lg border border-border">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">2</p>
            <p className="text-sm text-muted-foreground">AI Features Active</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Available Features */}
            <DashboardCard title="AI Features" featured={true}>
              <div className="space-y-4">
                {/* Active Features */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Available Now</h4>

                  <div className="flex items-center justify-between p-4 bg-background/80 rounded-lg border border-border hover:border-ring/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-foreground" />
                      <div>
                        <h5 className="font-medium">Conversational AI</h5>
                        <p className="text-sm text-muted-foreground">Chat with your data in plain English</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background/80 rounded-lg border border-border hover:border-ring/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-foreground" />
                      <div>
                        <h5 className="font-medium">AI Chart Generator</h5>
                        <p className="text-sm text-muted-foreground">Create visualizations with natural language</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      Active
                    </Badge>
                  </div>
                </div>

                {/* Coming Soon Features */}
                <div className="space-y-3 pt-6 border-t border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Coming Soon</h4>

                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <Lock className="h-3 w-3 text-muted-foreground absolute -bottom-1 -right-1" />
                      </div>
                      <div>
                        <h5 className="font-medium">Automated Reports</h5>
                        <p className="text-sm text-muted-foreground">AI-generated business insights</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground border-border">
                      <Clock className="h-3 w-3 mr-1" />
                      Soon
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Brain className="h-5 w-5 text-muted-foreground" />
                        <Lock className="h-3 w-3 text-muted-foreground absolute -bottom-1 -right-1" />
                      </div>
                      <div>
                        <h5 className="font-medium">Predictive Analytics</h5>
                        <p className="text-sm text-muted-foreground">Forecast trends and outcomes</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground border-border">
                      <Clock className="h-3 w-3 mr-1" />
                      Soon
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <FileSearch className="h-5 w-5 text-muted-foreground" />
                        <Lock className="h-3 w-3 text-muted-foreground absolute -bottom-1 -right-1" />
                      </div>
                      <div>
                        <h5 className="font-medium">Document Intelligence</h5>
                        <p className="text-sm text-muted-foreground">Extract data from documents</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground border-border">
                      <Clock className="h-3 w-3 mr-1" />
                      Soon
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <Lock className="h-3 w-3 text-muted-foreground absolute -bottom-1 -right-1" />
                      </div>
                      <div>
                        <h5 className="font-medium">Competitive Intelligence</h5>
                        <p className="text-sm text-muted-foreground">Monitor market trends</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground border-border">
                      <Clock className="h-3 w-3 mr-1" />
                      Soon
                    </Badge>
                  </div>
                </div>

                {/* Action Section */}
                {files.length === 0 ? (
                  <div className="text-center py-8 border-t border-border mt-6">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
                    <h3 className="text-lg font-medium mb-2">Ready for AI Analysis</h3>
                    <p className="text-muted-foreground mb-6">
                      Upload your business data to unlock AI-powered insights
                    </p>
                    <Button variant="secondary" size="lg" asChild>
                      <Link href="/dashboard/data">Upload Your First File</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6 border-t border-border mt-6">
                    <Button variant="secondary" size="lg" asChild>
                      <Link href="/dashboard/analyze">Start AI Analysis</Link>
                    </Button>
                  </div>
                )}
              </div>
            </DashboardCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <DashboardCard title="Quick Actions">
              <div className="space-y-3 p-2">
                <Button variant="secondary" className="w-full justify-start h-11" asChild>
                  <Link href="/dashboard/data">
                    <UploadCloud className="mr-2 h-5 w-5" /> Upload Data
                  </Link>
                </Button>

                {files.length > 0 && (
                  <Button variant="secondary" className="w-full justify-start h-11" asChild>
                    <Link href="/dashboard/analyze">
                      <MessageCircle className="mr-2 h-5 w-5" /> Start AI Chat
                    </Link>
                  </Button>
                )}

                <Button variant="outline" className="w-full justify-start h-11 opacity-50" disabled>
                  <LinkIcon className="mr-2 h-5 w-5" /> Connect Source
                  <Badge variant="outline" className="ml-auto text-xs">
                    Soon
                  </Badge>
                </Button>

                <Button variant="outline" className="w-full justify-start h-11 opacity-50" disabled>
                  <PlusCircle className="mr-2 h-5 w-5" /> Create Report
                  <Badge variant="outline" className="ml-auto text-xs">
                    Soon
                  </Badge>
                </Button>
              </div>
            </DashboardCard>

            {/* Recent Files */}
            <DashboardCard title="Recent Files">
              <div className="p-2">
                {filesLoading ? (
                  <div className="text-center py-4 text-muted-foreground">Loading files...</div>
                ) : recentFiles.length === 0 ? (
                  <div className="text-center text-muted-foreground py-6">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="mb-2 text-sm">No files uploaded yet</p>
                    <p className="mb-4 text-xs">Upload your first file to see it here</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/data">
                        <Database className="mr-2 h-4 w-4" /> Upload File
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <ul className="space-y-3">
                      {recentFiles.map((file) => (
                        <li key={file.id} className="border-b border-border pb-2 last:border-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start">
                              <FileText className="h-4 w-4 mt-1 mr-2 text-blue-400" />
                              <div>
                                <p className="font-medium text-sm">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(file.uploadDate), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href="/dashboard/analyze">
                                <MessageCircle className="h-3 w-3" />
                              </Link>
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 pt-2 border-t border-border">
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

            {/* Getting Started Tips */}
            <DashboardCard title="Getting Started">
              <div className="p-2 space-y-3">
                <div className="p-3 bg-background/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <p className="text-sm font-medium">AI-Powered</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload CSV or Excel files and start chatting with your data using natural language.
                  </p>
                </div>

                <div className="p-3 bg-background/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    <p className="text-sm font-medium">Smart Questions</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ask questions like "What's the average sales?" or "Show trends by month"
                  </p>
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
