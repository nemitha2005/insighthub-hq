'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { fetchAndParseFile } from '@/utils/fileUtils';
import { detectColumnTypes, generateSummary } from '@/services/analysisService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Table, BarChart, Info, Sparkles } from 'lucide-react';
import { FileData } from '@/services/storageService';
import { DashboardDataTable } from '@/components/dashboard/data-table';
import { DataSummaryPanel } from '@/components/dashboard/data-summary-panel';
import { BasicCharts } from '@/components/dashboard/basic-charts';
import { AIQueryComponent } from '@/components/dashboard/ai-query';
import { ChartConfig } from '@/lib/gemini';

interface FileAnalysisPageProps {
  file: FileData;
  onBack: () => void;
}

export function FileAnalysisPage({ file, onBack }: FileAnalysisPageProps) {
  const { toast } = useToast();
  const { setCurrentFile, setAnalysisData, analysisData } = useAnalysis();
  const [activeTab, setActiveTab] = useState('data');
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Ask AI
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

        <TabsContent value="ai" className="space-y-4">
          <AIQueryComponent
            data={analysisData.records}
            columns={analysisData.columns}
            onChartGenerated={handleAIChartGenerated}
          />
        </TabsContent>

        <TabsContent value="data">
          <DashboardDataTable data={analysisData.records} />
        </TabsContent>

        <TabsContent value="summary">
          <DataSummaryPanel summary={analysisData.summary} />
        </TabsContent>

        <TabsContent value="visualize">
          <BasicCharts data={analysisData.records} aiConfig={aiChartConfig} />

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
    </div>
  );
}
