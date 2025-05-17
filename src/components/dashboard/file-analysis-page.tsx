'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { fetchAndParseFile } from '@/utils/fileUtils';
import { detectColumnTypes, generateSummary } from '@/services/analysisService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Table, BarChart, Info } from 'lucide-react';
import { FileData } from '@/services/storageService';
import { DashboardDataTable } from '@/components/dashboard/data-table';
import { DataSummaryPanel } from '@/components/dashboard/data-summary-panel';
import { BasicCharts } from '@/components/dashboard/basic-charts';

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Analyzing your data...</p>
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
        <p className="text-muted-foreground mb-4">{analysisData.error}</p>
        <button onClick={onBack} className="text-blue-500 hover:text-blue-400 underline">
          Go back to files
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
        <p className="text-muted-foreground mb-4">The selected file does not contain any data to analyze.</p>
        <button onClick={onBack} className="text-blue-500 hover:text-blue-400 underline">
          Go back to files
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{file.name}</h2>
          <p className="text-muted-foreground">
            {analysisData.records.length} rows · {analysisData.columns.length} columns
          </p>
        </div>
        <button onClick={onBack} className="text-sm text-blue-500 hover:text-blue-400">
          ← Back to files
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="data" className="flex items-center">
            <Table className="h-4 w-4 mr-2" />
            Data Table
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="visualize" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Visualize
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data">
          <DashboardDataTable data={analysisData.records} />
        </TabsContent>

        <TabsContent value="summary">
          <DataSummaryPanel summary={analysisData.summary} />
        </TabsContent>

        <TabsContent value="visualize">
          <BasicCharts data={analysisData.records} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
