import { ref, getBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { FileData } from '@/services/storageService';
import { parseCSV, parseExcel } from '@/services/analysisService';

export async function fetchAndParseFile(file: FileData): Promise<{ columns: string[]; data: Record<string, any>[] }> {
  try {
    console.log('Fetching file:', file.name, 'from path:', file.path);

    const fileRef = ref(storage, file.path);

    const fileBytes = await getBytes(fileRef);

    if (file.type.includes('csv') || file.name.toLowerCase().endsWith('.csv')) {
      const text = new TextDecoder('utf-8').decode(fileBytes);
      return parseCSV(text);
    } else if (
      file.type.includes('excel') ||
      file.type.includes('spreadsheet') ||
      file.name.toLowerCase().endsWith('.xlsx') ||
      file.name.toLowerCase().endsWith('.xls')
    ) {
      return parseExcel(fileBytes);
    } else {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
  } catch (error) {
    console.error('Error fetching and parsing file:', error);
    throw error;
  }
}
