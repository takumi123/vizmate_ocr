import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getGoogleDriveClient, downloadPDF } from '@/lib/google-drive';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const driveClient = await getGoogleDriveClient(req);
    const pdfBuffer = await downloadPDF(driveClient, params.id);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="document.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error fetching PDF:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PDF' },
      { status: 500 }
    );
  }
}