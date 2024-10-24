import { render, screen, fireEvent } from '@testing-library/react';
import { FolderList } from '@/components/folder-list';

const mockFolders = [
  {
    id: '1',
    name: 'Test Folder 1',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Test Folder 2',
    createdAt: '2024-01-02T00:00:00Z',
  },
];

describe('FolderList', () => {
  it('renders folder list correctly', () => {
    render(<FolderList folders={mockFolders} />);
    
    expect(screen.getByText('Test Folder 1')).toBeInTheDocument();
    expect(screen.getByText('Test Folder 2')).toBeInTheDocument();
  });

  it('displays formatted dates', () => {
    render(<FolderList folders={mockFolders} />);
    
    expect(screen.getByText(/Created: 1\/1\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/Created: 1\/2\/2024/)).toBeInTheDocument();
  });

  it('handles folder selection', async () => {
    const mockFetch = jest.fn(() => Promise.resolve());
    global.fetch = mockFetch;
    
    render(<FolderList folders={mockFolders} />);
    
    fireEvent.click(screen.getByText('Test Folder 1'));
    
    expect(mockFetch).toHaveBeenCalledWith('/api/folders/select', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folderId: '1' }),
    });
  });
});