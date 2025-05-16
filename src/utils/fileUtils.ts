import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { FileData } from '@/services/storageService';
import { parseCSV, parseExcel } from '@/services/analysisService';

export async function fetchAndParseFile(file: FileData): Promise<{ columns: string[]; data: Record<string, any>[] }> {
  try {
    const fileRef = ref(storage, file.path);
    const url = await getDownloadURL(fileRef);

    const response = await fetch(url);

    if (file.type.includes('csv') || file.name.toLowerCase().endsWith('.csv')) {
      const text = await response.text();
      return parseCSV(text);
    } else if (
      file.type.includes('excel') ||
      file.type.includes('spreadsheet') ||
      file.name.toLowerCase().endsWith('.xlsx') ||
      file.name.toLowerCase().endsWith('.xls')
    ) {
      const arrayBuffer = await response.arrayBuffer();
      return parseExcel(arrayBuffer);
    } else {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
  } catch (error) {
    console.error('Error fetching and parsing file:', error);
    throw error;
  }
}
