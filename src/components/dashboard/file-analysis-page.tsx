'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { fetchAndParseFile } from '@/utils/fileUtils';
import { detectColumnTypes, generateSummary } from '@/services/analysisService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Table, BarChart, Info, Sparkles, MessageCircle } from 'lucide-react';
import { FileData } from '@/services/storageService';
import { DashboardDataTable } from '@/components/dashboard/data-table';
import { DataSummaryPanel } from '@/components/dashboard/data-summary-panel';
import { BasicCharts } from '@/components/dashboard/basic-charts';
import { AIQueryComponent } from '@/components/dashboard/ai-query';
import { AIChat } from '@/components/dashboard/ai-chat';
import { ChartConfig } from '@/lib/gemini';

interface FileAnalysisPageProps {
  file: FileData;
  onBack: () => void;
}

export function FileAnalysisPage({ file, onBack }: FileAnalysisPageProps) {
  const { toast } = useToast();
  const { setCurrentFile, setAnalysisData, analysisData } = useAnalysis();
  const [activeTab, setActiveTab] = useState('chat');
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [aiChartConfig, setAiChartConfig] = useState<ChartConfig | undefined>(undefined);

  useEffect(() => {
    if (hasLoaded && analysisData.records.length > 0) {
      setIsLoading(false);
      return;
    }

    async function loadFileData() {
      setIsLoading(true);
      try {
        setCurrentFile(file);
        setAnalysisData({ isLoading: true, error: null });

        console.log('Starting to analyze file:', file.name);

        const { columns, data } = await fetchAndParseFile(file);

        console.log('File parsed successfully. Columns:', columns.length, 'Rows:', data.length);

        const columnTypes = detectColumnTypes(data);

        const summary = generateSummary(data, columnTypes);

        setAnalysisData({
          columns,
          records: data,
          summary,
          isLoading: false,
          error: null,
        });

        setHasLoaded(true);
        console.log('Analysis complete');
      } catch (error) {
        console.error('Error analyzing file:', error);
        setAnalysisData({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to analyze file',
        });
        toast({
          title: 'Error',
          description: 'Failed to analyze file. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadFileData();

    return () => {
      if (!hasLoaded) {
        setCurrentFile(null);
      }
    };
  }, [file.id]);

  const handleAIChartGenerated = (config: ChartConfig) => {
    setAiChartConfig(config);
    setActiveTab('visualize');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Analyzing your data...</p>
        <p className="text-sm text-muted-foreground mt-2">Parsing columns and detecting data types...</p>
      </div>
    );
  }

  if (analysisData.error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="p-3 bg-red-500/10 rounded-full mb-4">
          <Info className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Analysis Error</h3>
        <p className="text-muted-foreground mb-4 max-w-md">{analysisData.error}</p>
        <button onClick={onBack} className="text-blue-500 hover:text-blue-400 underline transition-colors">
          ← Go back to files
        </button>
      </div>
    );
  }

  if (!analysisData.records || analysisData.records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="p-3 bg-amber-500/10 rounded-full mb-4">
          <Info className="h-8 w-8 text-amber-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Data Found</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          The selected file does not contain any analyzable data. Please ensure your file has proper headers and data
          rows.
        </p>
        <button onClick={onBack} className="text-blue-500 hover:text-blue-400 underline transition-colors">
          ← Go back to files
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {file.name}
            {aiChartConfig && (
              <span className="text-base bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-full text-sm font-normal">
                ✨ AI Enhanced
              </span>
            )}
          </h2>
          <p className="text-muted-foreground">
            {analysisData.records.length.toLocaleString()} rows · {analysisData.columns.length} columns
          </p>
        </div>
        <button onClick={onBack} className="text-sm text-blue-500 hover:text-blue-400 transition-colors">
          ← Back to files
        </button>
      </div>

      {/* Enhanced Tabs with AI Chat */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Chart
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Data Table
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="visualize" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Visualize
            {aiChartConfig && <span className="ml-1 h-2 w-2 bg-yellow-500 rounded-full"></span>}
          </TabsTrigger>
        </TabsList>

        {/* AI Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Conversational Data Analysis</h3>
            </div>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Chat with AI to get insights, ask questions, and understand your data better. Try asking: "What patterns
              do you see?" or "Give me an overview of this data."
            </p>
          </div>
          <AIChat data={analysisData.records} columns={analysisData.columns} />
        </TabsContent>

        {/* Chart Generation Tab */}
        <TabsContent value="generate" className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">AI Chart Generator</h3>
            </div>
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              Describe the chart you want in plain English and AI will create it automatically. Try: "Show sales by
              month" or "Create a pie chart of departments."
            </p>
          </div>
          <AIQueryComponent
            data={analysisData.records}
            columns={analysisData.columns}
            onChartGenerated={handleAIChartGenerated}
          />
        </TabsContent>

        {/* Data Table Tab */}
        <TabsContent value="data">
          <DashboardDataTable data={analysisData.records} />
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary">
          <DataSummaryPanel summary={analysisData.summary} />
        </TabsContent>

        {/* Visualize Tab (Enhanced with AI) */}
        <TabsContent value="visualize">
          <BasicCharts data={analysisData.records} aiConfig={aiChartConfig} />

          {/* Clear AI Configuration */}
          {aiChartConfig && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    🤖 This chart was generated by AI
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    You can modify the settings above or ask AI to create a different visualization
                  </p>
                </div>
                <button
                  onClick={() => setAiChartConfig(undefined)}
                  className="text-xs text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200 underline"
                >
                  Reset to manual
                </button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-border">
        <div className="text-center p-4 bg-background/50 rounded-lg border">
          <p className="text-2xl font-bold">{analysisData.records.length.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Rows</p>
        </div>
        <div className="text-center p-4 bg-background/50 rounded-lg border">
          <p className="text-2xl font-bold">{analysisData.columns.length}</p>
          <p className="text-sm text-muted-foreground">Columns</p>
        </div>
        <div className="text-center p-4 bg-background/50 rounded-lg border">
          <p className="text-2xl font-bold">
            {Object.values(analysisData.summary.columnSummaries).filter((col) => col.min !== undefined).length}
          </p>
          <p className="text-sm text-muted-foreground">Numeric Columns</p>
        </div>
        <div className="text-center p-4 bg-background/50 rounded-lg border">
          <p className="text-2xl font-bold">{(file.size / 1024 / 1024).toFixed(1)}MB</p>
          <p className="text-sm text-muted-foreground">File Size</p>
        </div>
      </div>

      {/* AI Features Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">🚀 AI-Powered Features Available</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-purple-600" />
            <span className="text-purple-800 dark:text-purple-200">
              <strong>Conversational Analysis:</strong> Ask questions about your data in plain English
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-purple-800 dark:text-purple-200">
              <strong>Auto-Chart Generation:</strong> Describe charts and AI creates them instantly
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
