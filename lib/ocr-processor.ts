import { createWorker } from 'tesseract.js';
import { convertPDFPageToImage } from './pdf-to-image';
import { kv } from '@vercel/kv';

export class OCRProcessor {
  private worker: Tesseract.Worker | null = null;

  async initialize() {
    if (!this.worker) {
      this.worker = await createWorker();
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
    }
  }

  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }

  async processPDF(pdfBuffer: Buffer, fileId: string): Promise<string> {
    try {
      await this.initialize();
      
      // Convert PDF to image
      const imageBuffer = await convertPDFPageToImage(pdfBuffer);
      
      // Perform OCR
      if (!this.worker) throw new Error('OCR worker not initialized');
      const { data: { text } } = await this.worker.recognize(imageBuffer);
      
      // Store result in KV store
      await kv.set(`ocr:${fileId}`, text);
      await kv.set(`pdf:${fileId}:status`, 'completed');
      
      return text;
    } catch (error) {
      console.error('OCR processing error:', error);
      await kv.set(`pdf:${fileId}:status`, 'error');
      throw error;
    } finally {
      await this.terminate();
    }
  }

  async getResult(fileId: string): Promise<string | null> {
    return await kv.get(`ocr:${fileId}`);
  }

  async updateResult(fileId: string, text: string): Promise<void> {
    await kv.set(`ocr:${fileId}`, text);
  }
}