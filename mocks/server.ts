import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/folders', () => {
    return HttpResponse.json({
      folders: [
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
      ],
    });
  }),

  http.get('/api/pdfs', () => {
    return HttpResponse.json({
      pdfs: [
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
      ],
    });
  }),

  http.get('/api/ocr/:id', ({ params }) => {
    return HttpResponse.json({
      content: `Sample OCR content for file ${params.id}`,
    });
  }),
];

export const server = setupServer(...handlers);