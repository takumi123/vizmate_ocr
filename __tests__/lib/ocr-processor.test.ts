import { OCRProcessor } from '@/lib/ocr-processor';
import { kv } from '@vercel/kv';

jest.mock('@vercel/kv', () => ({
  kv: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

describe('OCRProcessor', () => {
  let processor: OCRProcessor;

  beforeEach(() => {
    processor = new OCRProcessor();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initializes and terminates worker correctly', async () => {
    await processor.initialize();
    expect(processor['worker']).not.toBeNull();

    await processor.terminate();
    expect(processor['worker']).toBeNull();
  });

  it('gets OCR result from KV store', async () => {
    const mockText = 'Sample OCR text';
    (kv.get as jest.Mock).mockResolvedValue(mockText);

    const result = await processor.getResult('test-file-id');
    expect(result).toBe(mockText);
    expect(kv.get).toHaveBeenCalledWith('ocr:test-file-id');
  });

  it('updates OCR result in KV store', async () => {
    const mockText = 'Updated OCR text';
    await processor.updateResult('test-file-id', mockText);

    expect(kv.set).toHaveBeenCalledWith('ocr:test-file-id', mockText);
  });
});