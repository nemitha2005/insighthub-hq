'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { detectColumnTypes } from '@/services/analysisService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface BasicChartsProps {
  data: Record<string, any>[];
}

interface ChartDataPoint {
  [key: string]: any;
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

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
      setYAxisColumn(numericColumn || columns[1] || columns[0]);
    }
  }, [columns, columnTypes, xAxisColumn, yAxisColumn]);

  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!xAxisColumn || !yAxisColumn || data.length === 0) return [];

    const groupedData = new Map<string, number>();
    const limitedData = data.slice(0, 20);

    limitedData.forEach((row) => {
      const xValue = String(row[xAxisColumn] || 'Undefined').slice(0, 20);
      const yValue = parseFloat(row[yAxisColumn]);

      if (!isNaN(yValue)) {
        if (groupedData.has(xValue)) {
          groupedData.set(xValue, groupedData.get(xValue)! + yValue);
        } else {
          groupedData.set(xValue, yValue);
        }
      }
    });

    return Array.from(groupedData.entries())
      .map(([key, value]) => {
        const dataPoint: ChartDataPoint = {
          name: key,
          value: value,
        };
        dataPoint[xAxisColumn] = key;
        dataPoint[yAxisColumn] = value;
        return dataPoint;
      })
      .sort((a, b) => Number(b[yAxisColumn]) - Number(a[yAxisColumn]));
  }, [data, xAxisColumn, yAxisColumn]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data available for visualization</p>
      </div>
    );
  }

  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat().format(value);
  };

  const formatAxisValue = (value: string) => {
    return value.length > 10 ? `${value.slice(0, 10)}...` : value;
  };

  const hasValidData = chartData.length > 0 && xAxisColumn && yAxisColumn;

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
                  {columns.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="h-96 w-full">
            {hasValidData ? (
              <ResponsiveContainer width="100%" height="100%">
                <>
                  {chartType === 'bar' && (
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis
                        dataKey={xAxisColumn}
                        tick={{ fontSize: 12 }}
                        tickFormatter={formatAxisValue}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={formatTooltipValue} />
                      <Tooltip
                        formatter={(value: number) => [formatTooltipValue(value), yAxisColumn]}
                        labelStyle={{ color: '#000' }}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey={yAxisColumn} fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}

                  {chartType === 'line' && (
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis
                        dataKey={xAxisColumn}
                        tick={{ fontSize: 12 }}
                        tickFormatter={formatAxisValue}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={formatTooltipValue} />
                      <Tooltip
                        formatter={(value: number) => [formatTooltipValue(value), yAxisColumn]}
                        labelStyle={{ color: '#000' }}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={yAxisColumn}
                        stroke="#8884d8"
                        strokeWidth={3}
                        dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2 }}
                      />
                    </LineChart>
                  )}

                  {chartType === 'pie' && (
                    <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <Pie
                        data={chartData.slice(0, 8)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.slice(0, 8).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [formatTooltipValue(value), yAxisColumn]}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  )}
                </>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full border-2 border-dashed border-border rounded-lg">
                <div className="text-center text-muted-foreground">
                  <p className="mb-2">Unable to generate chart</p>
                  <p className="text-sm">
                    {!xAxisColumn || !yAxisColumn
                      ? 'Please select both X-axis and Y-axis columns'
                      : 'No valid data found for selected columns'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {chartData.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                Showing {chartData.length} data points
                {data.length > 20 && ` (limited from ${data.length} total rows)`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
