import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { getToken } from 'next-auth/jwt';

export async function POST(req: Request) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { folderId } = await req.json();
    if (!folderId) {
      return NextResponse.json(
        { error: 'Folder ID is required' },
        { status: 400 }
      );
    }

    const userId = token.sub;
    await kv.set(`user:${userId}:folder`, folderId);

    return NextResponse.json({
      message: 'Folder selected successfully',
      folderId,
    });
  } catch (error) {
    console.error('Error selecting folder:', error);
    return NextResponse.json(
      { error: 'Failed to select folder' },
      { status: 500 }
    );
  }
}