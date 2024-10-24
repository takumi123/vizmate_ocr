import { GET, PUT } from '@/app/api/ocr/[id]/route';
import { getToken } from 'next-auth/jwt';
import { OCRProcessor } from '@/lib/ocr-processor';
import { getGoogleDriveClient, downloadPDF } from '@/lib/google-drive';

jest.mock('next-auth/jwt');
jest.mock('@/lib/google-drive');
jest.mock('@/lib/ocr-processor');

describe('OCR API', () => {
  beforeEach(() => {
    (getToken as jest.Mock).mockResolvedValue({ sub: 'user-1' });
  });

  describe('GET', () => {
    it('returns existing OCR result', async () => {
      const mockResult = 'Existing OCR result';
      jest.spyOn(OCRProcessor.prototype, 'getResult').mockResolvedValue(mockResult);

      const response = await GET(
        new Request('http://localhost:3000/api/ocr/1'),
        { params: { id: '1' } }
      );
      const data = await response.json();

      expect(data.content).toBe(mockResult);
    });

    it('processes new PDF if no result exists', async () => {
      jest.spyOn(OCRProcessor.prototype, 'getResult').mockResolvedValue(null);
      jest.spyOn(OCRProcessor.prototype, 'processPDF').mockResolvedValue('New OCR result');
      (getGoogleDriveClient as jest.Mock).mockResolvedValue({});
      (downloadPDF as jest.Mock).mockResolvedValue(Buffer.from('fake pdf'));

      const response = await GET(
        new Request('http://localhost:3000/api/ocr/1'),
        { params: { id: '1' } }
      );
      const data = await response.json();

      expect(data.content).toBe('New OCR result');
    });
  });

  describe('PUT', () => {
    it('updates OCR result successfully', async () => {
      const mockContent = 'Updated content';
      jest.spyOn(OCRProcessor.prototype, 'updateResult').mockResolvedValue();

      const response = await PUT(
        new Request('http://localhost:3000/api/ocr/1', {
          method: 'PUT',
          body: JSON.stringify({ content: mockContent }),
        }),
        { params: { id: '1' } }
      );
      const data = await response.json();

      expect(data.message).toBe('OCR result updated successfully');
    });
  });
});