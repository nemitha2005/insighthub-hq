import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  sample: any;
}

export interface ColumnSummary {
  min?: number;
  max?: number;
  average?: number;
  sum?: number;
  count: number;
  uniqueValues?: number;
  emptyCells?: number;
}

export interface DataSummary {
  rowCount: number;
  columnCount: number;
  columnSummaries: Record<string, ColumnSummary>;
}

export async function parseCSV(csvContent: string): Promise<{ columns: string[]; data: Record<string, any>[] }> {
  return new Promise<{ columns: string[]; data: Record<string, any>[] }>((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const cleanedData = results.data.map((row: any) => {
            const cleanedRow: Record<string, any> = {};
            Object.keys(row).forEach((key) => {
              const cleanKey = key.trim();
              if (cleanKey) {
                cleanedRow[cleanKey] = row[key];
              }
            });
            return cleanedRow;
          });

          const columns = results.meta.fields?.map((field) => field.trim()) || [];

          resolve({
            columns: columns.filter(Boolean),
            data: cleanedData,
          });
        } catch (err) {
          reject(err);
        }
      },
      error: (err: any) => {
        reject(new Error(err.message || 'CSV parsing error'));
      },
    });
  });
}

export async function parseExcel(fileBuffer: ArrayBuffer): Promise<{ columns: string[]; data: Record<string, any>[] }> {
  try {
    const workbook = XLSX.read(fileBuffer, { type: 'array', cellDates: true });
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];

    const data = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { raw: false, dateNF: 'yyyy-mm-dd' });

    const columns = data.length > 0 ? Object.keys(data[0]) : [];

    return { columns, data };
  } catch (err) {
    throw new Error(`Excel parsing error: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export function detectColumnTypes(data: Record<string, any>[]): Record<string, DataColumn> {
  const columns: Record<string, DataColumn> = {};

  if (data.length === 0) return columns;

  Object.keys(data[0]).forEach((colName) => {
    columns[colName] = {
      name: colName,
      type: 'string',
      sample: null,
    };
  });

  const sampleSize = Math.min(10, data.length);

  for (let i = 0; i < sampleSize; i++) {
    const row = data[i];

    Object.keys(row).forEach((colName) => {
      const value = row[colName];

      if (value == null) return;

      if (columns[colName].sample === null) {
        columns[colName].sample = value;
      }

      if (typeof value === 'number') {
        columns[colName].type = 'number';
      } else if (value instanceof Date) {
        columns[colName].type = 'date';
      } else if (typeof value === 'boolean') {
        columns[colName].type = 'boolean';
      }
    });
  }

  return columns;
}

export function generateSummary(data: Record<string, any>[], columns: Record<string, DataColumn>): DataSummary {
  const summary: DataSummary = {
    rowCount: data.length,
    columnCount: Object.keys(columns).length,
    columnSummaries: {},
  };

  Object.keys(columns).forEach((colName) => {
    const column = columns[colName];
    const columnSummary: ColumnSummary = {
      count: data.length,
      emptyCells: 0,
      uniqueValues: 0,
    };

    if (column.type === 'number') {
      const values = data
        .map((row) => row[colName])
        .filter((val) => val !== null && val !== undefined && !isNaN(val)) as number[];

      if (values.length > 0) {
        columnSummary.min = Math.min(...values);
        columnSummary.max = Math.max(...values);
        columnSummary.sum = values.reduce((sum, val) => sum + val, 0);
        columnSummary.average = columnSummary.sum / values.length;
      }

      columnSummary.emptyCells = data.length - values.length;
    }

    const uniqueValues = new Set();
    data.forEach((row) => {
      const val = row[colName];
      if (val === null || val === undefined) {
        columnSummary.emptyCells = (columnSummary.emptyCells || 0) + 1;
      } else {
        uniqueValues.add(val);
      }
    });

    columnSummary.uniqueValues = uniqueValues.size;

    summary.columnSummaries[colName] = columnSummary;
  });

  return summary;
}
