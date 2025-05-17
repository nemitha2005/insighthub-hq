'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { DataColumn, detectColumnTypes } from '@/services/analysisService';

interface BasicChartsProps {
  data: Record<string, any>[];
}

export function BasicCharts({ data }: BasicChartsProps) {
  const [chartType, setChartType] = useState('bar');
  const [xAxisColumn, setXAxisColumn] = useState<string | null>(null);
  const [yAxisColumn, setYAxisColumn] = useState<string | null>(null);

  const columnTypes = useMemo(() => detectColumnTypes(data), [data]);

  const columns = Object.keys(columnTypes);

  useMemo(() => {
    if (!xAxisColumn && columns.length > 0) {
      setXAxisColumn(columns[0]);
    }

    if (!yAxisColumn) {
      const numericColumn = columns.find((col) => columnTypes[col]?.type === 'number');
      setYAxisColumn(numericColumn || columns[0]);
    }
  }, [columns, columnTypes, xAxisColumn, yAxisColumn]);

  const numericColumns = columns.filter((col) => columnTypes[col]?.type === 'number');

  const chartData = useMemo(() => {
    if (!xAxisColumn || !yAxisColumn) return [];

    const groupedData = new Map<string, number>();

    const limitedData = data.slice(0, 15);

    limitedData.forEach((row) => {
      const xValue = String(row[xAxisColumn] || 'Undefined');
      const yValue = parseFloat(row[yAxisColumn]);

      if (!isNaN(yValue)) {
        if (groupedData.has(xValue)) {
          groupedData.set(xValue, groupedData.get(xValue)! + yValue);
        } else {
          groupedData.set(xValue, yValue);
        }
      }
    });

    return Array.from(groupedData.entries()).map(([key, value]) => ({
      x: key,
      y: value,
    }));
  }, [data, xAxisColumn, yAxisColumn]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available for visualization</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Visualize Your Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium block mb-2">Chart Type</label>
              <Tabs value={chartType} onValueChange={setChartType} className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="bar" className="flex-1">
                    <BarChartIcon className="h-4 w-4 mr-2" />
                    Bar
                  </TabsTrigger>
                  <TabsTrigger value="line" className="flex-1">
                    <LineChartIcon className="h-4 w-4 mr-2" />
                    Line
                  </TabsTrigger>
                  <TabsTrigger value="pie" className="flex-1">
                    <PieChartIcon className="h-4 w-4 mr-2" />
                    Pie
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">X-Axis (Category)</label>
              <Select value={xAxisColumn || undefined} onValueChange={setXAxisColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Y-Axis (Value)</label>
              <Select value={yAxisColumn || undefined} onValueChange={setYAxisColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {numericColumns.length > 0 ? (
                    numericColumns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>
                      No numeric columns available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="aspect-[3/2] w-full bg-background border rounded-md p-4 flex items-center justify-center">
            {chartData.length > 0 ? (
              <ChartDisplay
                type={chartType}
                data={chartData}
                xAxisName={xAxisColumn || ''}
                yAxisName={yAxisColumn || ''}
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <p>Not enough data to generate chart.</p>
                <p className="text-sm">Select different columns or ensure data contains numeric values.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ChartDisplayProps {
  type: string;
  data: { x: string; y: number }[];
  xAxisName: string;
  yAxisName: string;
}

function ChartDisplay({ type, data, xAxisName, yAxisName }: ChartDisplayProps) {
  // For now we'll use a placeholder component
  // In real implementation, you would use a charting library like Recharts, Chart.js, etc.
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="text-sm text-muted-foreground mb-4">
        <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)} Chart:</span> {xAxisName} vs{' '}
        {yAxisName}
      </div>

      {/* Placeholder visualization */}
      <div className="w-full max-w-md">
        <div className="flex flex-col space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 truncate pr-2 text-xs">{item.x}</div>
              <div className="flex-1 h-5 bg-muted overflow-hidden rounded-sm">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${Math.min(100, (item.y / Math.max(...data.map((d) => d.y))) * 100)}%`,
                  }}
                />
              </div>
              <div className="w-16 pl-2 text-xs text-right">{item.y.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-4 text-sm text-muted-foreground">
        <p>This is a placeholder visualization.</p>
        <p>In the next update, we'll integrate with Recharts library for interactive charts.</p>
      </div>
    </div>
  );
}
