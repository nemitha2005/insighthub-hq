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
        <div className="animate-pulse text-lg sm:text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 pb-8 sm:pb-16">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">Your Dashboard</h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            View insights, analyze data and create reports with AI-powered business intelligence
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="text-center p-3 sm:p-6 bg-background/50 rounded-lg border border-border">
            <Database className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-lg sm:text-2xl font-bold">{files.length}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Total Files</p>
          </div>

          <div className="text-center p-3 sm:p-6 bg-background/50 rounded-lg border border-border">
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-lg sm:text-2xl font-bold">{totalDataPoints.toFixed(0)}KB</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Data Processed</p>
          </div>

          <div className="text-center p-3 sm:p-6 bg-background/50 rounded-lg border border-border">
            <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-lg sm:text-2xl font-bold">∞</p>
            <p className="text-xs sm:text-sm text-muted-foreground">AI Queries Available</p>
          </div>

          <div className="text-center p-3 sm:p-6 bg-background/50 rounded-lg border border-border">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-lg sm:text-2xl font-bold">2</p>
            <p className="text-xs sm:text-sm text-muted-foreground">AI Features Active</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <DashboardCard title="AI Features" featured={true}>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Available Now</h4>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-background/80 rounded-lg border border-border hover:border-ring/30 transition-colors">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                      <div>
                        <h5 className="font-medium text-sm sm:text-base">Conversational AI</h5>
                        <p className="text-xs sm:text-sm text-muted-foreground">Chat with your data in plain English</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-300 text-xs">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-background/80 rounded-lg border border-border hover:border-ring/30 transition-colors">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                      <div>
                        <h5 className="font-medium text-sm sm:text-base">AI Chart Generator</h5>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Create visualizations with natural language
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-300 text-xs">
                      Active
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Coming Soon</h4>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-background/50 rounded-lg border border-border opacity-60">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="relative">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        <Lock className="h-2 w-2 sm:h-3 sm:w-3 text-muted-foreground absolute -bottom-1 -right-1" />
                      </div>
                      <div>
                        <h5 className="font-medium text-sm sm:text-base">Automated Reports</h5>
                        <p className="text-xs sm:text-sm text-muted-foreground">AI-generated business insights</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground border-border text-xs">
                      <Clock className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                      Soon
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-background/50 rounded-lg border border-border opacity-60">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="relative">
                        <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        <Lock className="h-2 w-2 sm:h-3 sm:w-3 text-muted-foreground absolute -bottom-1 -right-1" />
                      </div>
                      <div>
                        <h5 className="font-medium text-sm sm:text-base">Predictive Analytics</h5>
                        <p className="text-xs sm:text-sm text-muted-foreground">Forecast trends and outcomes</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground border-border text-xs">
                      <Clock className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                      Soon
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-background/50 rounded-lg border border-border opacity-60">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="relative">
                        <FileSearch className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        <Lock className="h-2 w-2 sm:h-3 sm:w-3 text-muted-foreground absolute -bottom-1 -right-1" />
                      </div>
                      <div>
                        <h5 className="font-medium text-sm sm:text-base">Document Intelligence</h5>
                        <p className="text-xs sm:text-sm text-muted-foreground">Extract data from documents</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground border-border text-xs">
                      <Clock className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                      Soon
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 sm:p-4 bg-background/50 rounded-lg border border-border opacity-60">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="relative">
                        <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        <Lock className="h-2 w-2 sm:h-3 sm:w-3 text-muted-foreground absolute -bottom-1 -right-1" />
                      </div>
                      <div>
                        <h5 className="font-medium text-sm sm:text-base">Competitive Intelligence</h5>
                        <p className="text-xs sm:text-sm text-muted-foreground">Monitor market trends</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground border-border text-xs">
                      <Clock className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                      Soon
                    </Badge>
                  </div>
                </div>

                {files.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 border-t border-border mt-6">
                    <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-4 mx-auto" />
                    <h3 className="text-base sm:text-lg font-medium mb-2">Ready for AI Analysis</h3>
                    <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base px-4">
                      Upload your business data to unlock AI-powered insights
                    </p>
                    <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto">
                      <Link href="/dashboard/data">Upload Your First File</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4 sm:py-6 border-t border-border mt-6">
                    <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto">
                      <Link href="/dashboard/analyze">Start AI Analysis</Link>
                    </Button>
                  </div>
                )}
              </div>
            </DashboardCard>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <DashboardCard title="Quick Actions">
              <div className="space-y-3 p-2">
                <Button variant="secondary" className="w-full justify-start h-10 sm:h-11" asChild>
                  <Link href="/dashboard/data">
                    <UploadCloud className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base">Upload Data</span>
                  </Link>
                </Button>

                {files.length > 0 && (
                  <Button variant="secondary" className="w-full justify-start h-10 sm:h-11" asChild>
                    <Link href="/dashboard/analyze">
                      <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">Start AI Chat</span>
                    </Link>
                  </Button>
                )}

                <Button variant="outline" className="w-full justify-start h-10 sm:h-11 opacity-50" disabled>
                  <LinkIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Connect Source</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    Soon
                  </Badge>
                </Button>

                <Button variant="outline" className="w-full justify-start h-10 sm:h-11 opacity-50" disabled>
                  <PlusCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Create Report</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    Soon
                  </Badge>
                </Button>
              </div>
            </DashboardCard>

            <DashboardCard title="Recent Files">
              <div className="p-2">
                {filesLoading ? (
                  <div className="text-center py-4 text-muted-foreground text-sm sm:text-base">Loading files...</div>
                ) : recentFiles.length === 0 ? (
                  <div className="text-center text-muted-foreground py-4 sm:py-6">
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
                    <p className="mb-2 text-sm">No files uploaded yet</p>
                    <p className="mb-3 sm:mb-4 text-xs">Upload your first file to see it here</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard/data">
                        <Database className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">Upload File</span>
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <>
                    <ul className="space-y-3">
                      {recentFiles.map((file) => (
                        <li key={file.id} className="border-b border-border pb-2 last:border-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start mr-2">
                              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mt-1 mr-2 text-blue-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="font-medium text-xs sm:text-sm truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(file.uploadDate), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
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
                          <Database className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">View All Files</span>
                        </Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DashboardCard>

            <DashboardCard title="Getting Started">
              <div className="p-2 space-y-3">
                <div className="p-3 bg-background/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                    <p className="text-xs sm:text-sm font-medium">AI-Powered</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload CSV or Excel files and start chatting with your data using natural language.
                  </p>
                </div>

                <div className="p-3 bg-background/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                    <p className="text-xs sm:text-sm font-medium">Smart Questions</p>
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
