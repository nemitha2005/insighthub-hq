import { DataSummary } from '@/services/analysisService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataSummaryPanelProps {
  summary: DataSummary;
}

export function DataSummaryPanel({ summary }: DataSummaryPanelProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDecimal = (num: number | undefined) => {
    if (num === undefined) return '-';
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rows</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatNumber(summary.rowCount)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Columns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatNumber(summary.columnCount)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Cells</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatNumber(summary.rowCount * summary.columnCount)}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Column Summaries</h3>
        <div className="border rounded-lg divide-y">
          {Object.entries(summary.columnSummaries).map(([columnName, columnSummary]) => (
            <div key={columnName} className="p-4">
              <h4 className="font-medium mb-2">{columnName}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {columnSummary.min !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Min</p>
                    <p className="font-medium">{formatDecimal(columnSummary.min)}</p>
                  </div>
                )}

                {columnSummary.max !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Max</p>
                    <p className="font-medium">{formatDecimal(columnSummary.max)}</p>
                  </div>
                )}

                {columnSummary.average !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Average</p>
                    <p className="font-medium">{formatDecimal(columnSummary.average)}</p>
                  </div>
                )}

                {columnSummary.sum !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Sum</p>
                    <p className="font-medium">{formatDecimal(columnSummary.sum)}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Unique Values</p>
                  <p className="font-medium">{formatNumber(columnSummary.uniqueValues || 0)}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Empty Cells</p>
                  <p className="font-medium">{formatNumber(columnSummary.emptyCells || 0)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
