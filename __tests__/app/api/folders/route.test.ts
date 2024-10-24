import { GET } from '@/app/api/folders/route';
import { getGoogleDriveClient, listFolders } from '@/lib/google-drive';

jest.mock('@/lib/google-drive', () => ({
  getGoogleDriveClient: jest.fn(),
  listFolders: jest.fn(),
}));

describe('Folders API', () => {
  it('returns folders list successfully', async () => {
    const mockFolders = [
      {
        id: '1',
        name: 'Test Folder 1',
        createdTime: '2024-01-01T00:00:00Z',
      },
    ];

    (getGoogleDriveClient as jest.Mock).mockResolvedValue({});
    (listFolders as jest.Mock).mockResolvedValue(mockFolders);

    const response = await GET(new Request('http://localhost:3000/api/folders'));
    const data = await response.json();

    expect(data.folders).toHaveLength(1);
    expect(data.folders[0]).toEqual({
      id: '1',
      name: 'Test Folder 1',
      createdAt: '2024-01-01T00:00:00Z',
    });
  });

  it('handles errors appropriately', async () => {
    (getGoogleDriveClient as jest.Mock).mockRejectedValue(new Error('API Error'));

    const response = await GET(new Request('http://localhost:3000/api/folders'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch folders');
  });
});