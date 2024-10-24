import { NextResponse } from 'next/server';
import { getGoogleDriveClient, listFolders } from '@/lib/google-drive';

export async function GET(req: Request) {
  try {
    const driveClient = await getGoogleDriveClient(req);
    const folders = await listFolders(driveClient);

    return NextResponse.json({
      folders: folders.map((folder: any) => ({
        id: folder.id,
        name: folder.name,
        createdAt: folder.createdTime,
      })),
    });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch folders' },
      { status: 500 }
    );
  }
}