'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { analyzeDataQuery, generateExampleQueries, ChartConfig } from '@/lib/gemini';
import { useToast } from '@/components/ui/use-toast';

interface AIQueryComponentProps {
  data: Record<string, any>[];
  columns: string[];
  onChartGenerated: (config: ChartConfig) => void;
}

export function AIQueryComponent({ data, columns, onChartGenerated }: AIQueryComponentProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message: string;
    config?: ChartConfig;
  } | null>(null);

  const { toast } = useToast();

  const exampleQueries = generateExampleQueries(columns);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processQuery(query);
  };

  const processQuery = async (queryText: string) => {
    if (!queryText.trim()) {
      toast({
        title: 'Empty Query',
        description: 'Please enter a question about your data',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setLastResult(null);

    try {
      const sampleData = data.length > 0 ? data[0] : {};

      const result = await analyzeDataQuery(queryText, columns, sampleData);

      setLastResult({
        success: result.success,
        message: result.message,
        config: result.chartConfig,
      });

      if (result.success && result.chartConfig) {
        onChartGenerated(result.chartConfig);
        toast({
          title: 'Chart Generated!',
          description: result.chartConfig.description,
        });
      } else {
        toast({
          title: 'Query Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error processing query:', error);
      setLastResult({
        success: false,
        message: 'An unexpected error occurred. Please try again.',
      });
      toast({
        title: 'Error',
        description: 'Failed to process your query. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  const resetQuery = () => {
    setQuery('');
    setLastResult(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-background/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Ask AI About Your Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about your data: 'Show sales trends by month'"
                className="flex-1 bg-background border-border"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !query.trim()} variant="secondary">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {isLoading ? 'Processing...' : 'Ask AI'}
              </Button>
              {query && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetQuery}
                  disabled={isLoading}
                  className="border-border"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>

          {exampleQueries.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Try these questions:</h4>
              <div className="flex flex-wrap gap-2">
                {exampleQueries.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleExampleClick(example)}
                    disabled={isLoading}
                    className="text-xs h-8 border-border hover:bg-background/80"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {lastResult && (
            <div
              className={`p-4 rounded-lg border backdrop-blur-sm ${
                lastResult.success
                  ? 'border-green-200 bg-green-50/80 dark:border-green-800 dark:bg-green-950/50'
                  : 'border-red-200 bg-red-50/80 dark:border-red-800 dark:bg-red-950/50'
              }`}
            >
              <div className="flex items-start gap-3">
                {lastResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      lastResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                    }`}
                  >
                    {lastResult.success ? 'Success!' : 'Unable to Process'}
                  </p>
                  <p
                    className={`text-sm ${
                      lastResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                    }`}
                  >
                    {lastResult.message}
                  </p>
                  {lastResult.config && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <p>
                        Chart: {lastResult.config.chartType} | X: {lastResult.config.xAxis} | Y:{' '}
                        {lastResult.config.yAxis}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1 p-3 bg-background/30 rounded-lg border border-border">
            <p className="font-medium">💡 Tips for better results:</p>
            <ul className="list-disc list-inside space-y-0.5 pl-2">
              <li>Be specific: "Show sales by month" is better than "show sales"</li>
              <li>Use column names: "revenue by product category"</li>
              <li>Mention chart types: "line chart of trends" or "pie chart of distribution"</li>
              <li>
                Available columns: {columns.slice(0, 5).join(', ')}
                {columns.length > 5 && '...'}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
