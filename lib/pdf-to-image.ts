import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import { createCanvas } from 'canvas';

export async function convertPDFPageToImage(pdfBuffer: Buffer, pageNumber: number = 0): Promise<Buffer> {
  try {
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const page = pdfDoc.getPages()[pageNumber];
    
    // Get page dimensions
    const { width, height } = page.getSize();
    
    // Create a canvas with the page dimensions
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    
    // Draw the PDF page to the canvas
    const pngBytes = await page.png();
    const image = await sharp(Buffer.from(pngBytes))
      .resize(Math.round(width), Math.round(height), {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toBuffer();
    
    return image;
  } catch (error) {
    console.error('Error converting PDF to image:', error);
    throw error;
  }
}