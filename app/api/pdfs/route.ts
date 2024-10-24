import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { kv } from '@vercel/kv';
import { getGoogleDriveClient, listPDFs } from '@/lib/google-drive';

export async function GET(req: Request) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = token.sub;
    const folderId = await kv.get(`user:${userId}:folder`);
    if (!folderId) {
      return NextResponse.json(
        { error: 'No folder selected' },
        { status: 400 }
      );
    }

    const driveClient = await getGoogleDriveClient(req);
    const pdfs = await listPDFs(driveClient, folderId as string);

    const pdfList = await Promise.all(
      pdfs.map(async (pdf: any) => {
        const status = await kv.get(`pdf:${pdf.id}:status`) || 'pending';
        return {
          id: pdf.id,
          name: pdf.name,
          uploadedAt: pdf.createdTime,
          status,
        };
      })
    );

    return NextResponse.json({ pdfs: pdfList });
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PDFs' },
      { status: 500 }
    );
  }
}