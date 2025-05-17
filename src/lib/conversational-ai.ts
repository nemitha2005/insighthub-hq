import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export interface ConversationResponse {
  success: boolean;
  answer: string;
  insights?: string[];
  statistics?: Array<{
    label: string;
    value: string | number;
  }>;
  error?: string;
}

export async function askAboutData(
  query: string,
  data: Record<string, any>[],
  columns: string[],
): Promise<ConversationResponse> {
  try {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const dataStats = generateBasicStats(data, columns);

    const sampleData = data.slice(0, 5);

    const prompt = `
You are a data analyst assistant. Answer the user's question about their dataset in a conversational, helpful way.

USER QUESTION: "${query}"

DATASET INFORMATION:
- Total rows: ${data.length}
- Columns: ${columns.join(', ')}
- Sample data: ${JSON.stringify(sampleData, null, 2)}

BASIC STATISTICS:
${dataStats}

INSTRUCTIONS:
1. Answer the user's question directly and conversationally
2. Provide specific numbers and calculations when relevant
3. Include insights or patterns you notice
4. Be helpful and explain your reasoning
5. If you can't answer precisely, explain what you can determine
6. Keep responses concise but informative
7. Use a friendly, professional tone

RESPONSE FORMAT:
Provide a natural, conversational answer. Don't use JSON or structured format - just write as if you're talking to the user.

Examples of good responses:
- "Based on your data, you have 150 employees with an average salary of $75,000. The Engineering department has the highest average salary at $95,000."
- "I can see 3 main trends in your sales data: Q1 had the strongest growth at 15%, Premium products are your best performers, and the North region outperformed others by 20%."
- "Your dataset shows 5 employees with ages ranging from 25 to 45. The most common department is Engineering with 3 employees."
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text().trim();

    const statistics = extractStatistics(answer, data, columns);

    const insights = generateInsights(data, columns);

    return {
      success: true,
      answer,
      statistics,
      insights,
    };
  } catch (error) {
    console.error('Conversational AI error:', error);

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return {
          success: false,
          answer: 'API key issue. Please check your Gemini configuration.',
          error: error.message,
        };
      }
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return {
          success: false,
          answer: 'API quota exceeded. Please try again later.',
          error: error.message,
        };
      }
    }

    return {
      success: false,
      answer: 'I encountered an issue analyzing your data. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

function generateBasicStats(data: Record<string, any>[], columns: string[]): string {
  const stats: string[] = [];

  columns.forEach((column) => {
    const values = data.map((row) => row[column]).filter((val) => val !== null && val !== undefined);

    if (values.length === 0) return;

    const numericValues = values.filter((val) => !isNaN(Number(val))).map((val) => Number(val));

    if (numericValues.length > 0 && numericValues.length === values.length) {
      const sum = numericValues.reduce((a, b) => a + b, 0);
      const avg = sum / numericValues.length;
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);

      stats.push(`${column}: avg=${avg.toFixed(2)}, min=${min}, max=${max}, total=${sum.toFixed(2)}`);
    } else {
      const uniqueValues = new Set(values);
      const mostCommon = findMostCommon(values);

      stats.push(`${column}: ${uniqueValues.size} unique values, most common="${mostCommon}"`);
    }
  });

  return stats.join('\n');
}

function findMostCommon(values: any[]): any {
  const counts = new Map<any, number>();
  values.forEach((val) => {
    counts.set(val, (counts.get(val) || 0) + 1);
  });

  let maxCount = 0;
  let mostCommon = null;

  counts.forEach((count, value) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = value;
    }
  });

  return mostCommon;
}

function extractStatistics(
  answer: string,
  data: Record<string, any>[],
  columns: string[],
): Array<{ label: string; value: string | number }> {
  const statistics: Array<{ label: string; value: string | number }> = [];

  statistics.push({ label: 'Total Records', value: data.length }, { label: 'Columns', value: columns.length });

  const numberMatches = answer.match(/(\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g);
  if (numberMatches && numberMatches.length > 0) {
    numberMatches.slice(0, 3).forEach((match, index) => {
      statistics.push({
        label: `Key Figure ${index + 1}`,
        value: match,
      });
    });
  }

  return statistics;
}

function generateInsights(data: Record<string, any>[], columns: string[]): string[] {
  const insights: string[] = [];

  const emptyFields = columns
    .map((col) => {
      const emptyCount = data.filter((row) => !row[col] || row[col] === '').length;
      return { column: col, emptyCount, percentage: (emptyCount / data.length) * 100 };
    })
    .filter((item) => item.emptyCount > 0);

  if (emptyFields.length > 0) {
    insights.push(`Data quality: ${emptyFields.length} columns have missing values`);
  } else {
    insights.push('Data quality: Complete dataset with no missing values');
  }

  if (data.length < 100) {
    insights.push('Dataset size: Small dataset - consider gathering more data for better analysis');
  } else if (data.length > 10000) {
    insights.push('Dataset size: Large dataset - excellent for comprehensive analysis');
  } else {
    insights.push('Dataset size: Good size for meaningful analysis');
  }

  if (columns.length > 10) {
    insights.push('Rich dataset: Many columns available for multidimensional analysis');
  } else if (columns.length < 3) {
    insights.push('Simple dataset: Limited columns - consider what additional data might be valuable');
  }

  return insights;
}

export function generateConversationStarters(columns: string[]): string[] {
  const starters: string[] = [];

  const numericSuggestions = ['sales', 'revenue', 'amount', 'price', 'quantity', 'total', 'salary', 'age', 'score'];
  const numericColumns = columns.filter((col) =>
    numericSuggestions.some((suggestion) => col.toLowerCase().includes(suggestion)),
  );

  const categoryColumns = columns.filter(
    (col) =>
      col.toLowerCase().includes('category') ||
      col.toLowerCase().includes('type') ||
      col.toLowerCase().includes('department') ||
      col.toLowerCase().includes('region') ||
      col.toLowerCase().includes('status'),
  );

  if (numericColumns.length > 0) {
    starters.push(`What's the average ${numericColumns[0]}?`);
    starters.push(`What's the total ${numericColumns[0]}?`);
  }

  if (categoryColumns.length > 0) {
    starters.push(`How many unique ${categoryColumns[0]} are there?`);
    starters.push(`What's the most common ${categoryColumns[0]}?`);
  }

  if (numericColumns.length > 0 && categoryColumns.length > 0) {
    starters.push(`Which ${categoryColumns[0]} has the highest ${numericColumns[0]}?`);
  }

  starters.push('Give me an overview of this data');
  starters.push('What patterns do you see?');
  starters.push('What insights can you provide?');
  starters.push('How many records are in this dataset?');

  return starters.slice(0, 6);
}
