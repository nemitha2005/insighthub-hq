import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export interface ChartConfig {
  chartType: 'bar' | 'line' | 'pie';
  xAxis: string;
  yAxis: string;
  aggregation: 'sum' | 'average' | 'count' | 'max' | 'min';
  title: string;
  description: string;
}

export interface AIQueryResponse {
  success: boolean;
  chartConfig?: ChartConfig;
  message: string;
  error?: string;
}

export async function analyzeDataQuery(
  query: string,
  columns: string[],
  sampleData: Record<string, any>,
): Promise<AIQueryResponse> {
  try {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are a data visualization expert. A user wants to create a chart from their data.

USER QUERY: "${query}"

AVAILABLE COLUMNS: ${columns.join(', ')}

SAMPLE DATA (first row): ${JSON.stringify(sampleData, null, 2)}

TASK: Convert this natural language query into a chart configuration.

RESPONSE FORMAT (JSON only, no markdown or code blocks):
{
  "success": true,
  "chartType": "bar" | "line" | "pie",
  "xAxis": "column_name",
  "yAxis": "column_name", 
  "aggregation": "sum" | "average" | "count" | "max" | "min",
  "title": "Chart Title",
  "description": "Brief description of what the chart shows"
}

IMPORTANT: Return only valid JSON without any markdown formatting, code blocks, or additional text.

RULES:
1. Choose the most appropriate chart type for the query
2. Select columns that exist in the available columns list
3. Use aggregation when multiple rows have the same x-axis value
4. For "trends over time" use line charts
5. For "comparison between categories" use bar charts
6. For "parts of a whole" use pie charts
7. If query is unclear or impossible, return {"success": false, "message": "explanation"}

Examples:
- "sales by month" → bar chart, x=month, y=sales, aggregation=sum
- "revenue trends over time" → line chart, x=date, y=revenue, aggregation=sum
- "product distribution" → pie chart, x=product, y=count, aggregation=count
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      let cleanText = text.trim();

      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      console.log('Cleaned AI response:', cleanText);

      const parsed = JSON.parse(cleanText);

      if (parsed.success === false) {
        return {
          success: false,
          message: parsed.message || 'Unable to interpret the query',
        };
      }

      if (!columns.includes(parsed.xAxis) || !columns.includes(parsed.yAxis)) {
        return {
          success: false,
          message: `Selected columns don't exist. Available columns: ${columns.join(', ')}`,
        };
      }

      return {
        success: true,
        chartConfig: {
          chartType: parsed.chartType,
          xAxis: parsed.xAxis,
          yAxis: parsed.yAxis,
          aggregation: parsed.aggregation,
          title: parsed.title,
          description: parsed.description,
        },
        message: 'Chart configuration generated successfully',
      };
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      console.error('Parse error details:', parseError);
      return {
        success: false,
        message: 'Unable to understand the query. Please try rephrasing.',
        error: 'Parse error',
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return {
          success: false,
          message: 'API key issue. Please check your Gemini configuration.',
          error: error.message,
        };
      }
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return {
          success: false,
          message: 'API quota exceeded. Please try again later.',
          error: error.message,
        };
      }
    }

    return {
      success: false,
      message: 'AI service temporarily unavailable. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function generateExampleQueries(columns: string[]): string[] {
  const examples: string[] = [];

  const dateColumns = columns.filter(
    (col) =>
      col.toLowerCase().includes('date') ||
      col.toLowerCase().includes('time') ||
      col.toLowerCase().includes('month') ||
      col.toLowerCase().includes('year'),
  );

  const numericSuggestions = ['sales', 'revenue', 'amount', 'price', 'quantity', 'total', 'salary', 'age'];
  const numericColumns = columns.filter((col) =>
    numericSuggestions.some((suggestion) => col.toLowerCase().includes(suggestion)),
  );

  const categoryColumns = columns.filter(
    (col) =>
      col.toLowerCase().includes('category') ||
      col.toLowerCase().includes('type') ||
      col.toLowerCase().includes('product') ||
      col.toLowerCase().includes('region') ||
      col.toLowerCase().includes('department') ||
      col.toLowerCase().includes('name'),
  );

  if (dateColumns.length > 0 && numericColumns.length > 0) {
    examples.push(`Show ${numericColumns[0]} trends over ${dateColumns[0]}`);
  }

  if (categoryColumns.length > 0 && numericColumns.length > 0) {
    examples.push(`Compare ${numericColumns[0]} by ${categoryColumns[0]}`);
  }

  if (categoryColumns.length > 0) {
    examples.push(`Show distribution of ${categoryColumns[0]}`);
  }

  if (examples.length === 0) {
    if (columns.length >= 2) {
      examples.push(`Show ${columns[1]} by ${columns[0]}`);
      examples.push(`Compare ${columns[0]} across ${columns[1]}`);
    }
  }

  examples.push('What are the top 10 values?');
  examples.push('Show me the trends over time');
  examples.push('Which category has the highest total?');

  return examples.slice(0, 4);
}
