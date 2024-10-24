import { render, screen } from '@testing-library/react';
import { PDFList } from '@/components/pdf-list';

const mockPDFs = [
  {
    id: '1',
    name: 'Test PDF 1.pdf',
    uploadedAt: '2024-01-01T00:00:00Z',
    status: 'completed',
  },
  {
    id: '2',
    name: 'Test PDF 2.pdf',
    uploadedAt: '2024-01-02T00:00:00Z',
    status: 'processing',
  },
];

describe('PDFList', () => {
  it('renders PDF list correctly', () => {
    render(<PDFList pdfs={mockPDFs} />);
    
    expect(screen.getByText('Test PDF 1.pdf')).toBeInTheDocument();
    expect(screen.getByText('Test PDF 2.pdf')).toBeInTheDocument();
  });

  it('displays correct status icons', () => {
    render(<PDFList pdfs={mockPDFs} />);
    
    expect(screen.getByText('completed')).toBeInTheDocument();
    expect(screen.getByText('processing')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<PDFList pdfs={mockPDFs} />);
    
    expect(screen.getByText(/Uploaded: 1\/1\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/Uploaded: 1\/2\/2024/)).toBeInTheDocument();
  });
});