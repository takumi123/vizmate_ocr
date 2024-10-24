import { google } from 'googleapis';
import { getToken } from 'next-auth/jwt';

export async function getGoogleDriveClient(req: Request) {
  const token = await getToken({ req });
  if (!token?.accessToken) {
    throw new Error('No access token found');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: token.accessToken,
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

export async function listFolders(driveClient: any) {
  const response = await driveClient.files.list({
    q: "mimeType='application/vnd.google-apps.folder'",
    fields: 'files(id, name, createdTime)',
    spaces: 'drive',
  });

  return response.data.files;
}

export async function listPDFs(driveClient: any, folderId: string) {
  const response = await driveClient.files.list({
    q: `'${folderId}' in parents and mimeType='application/pdf'`,
    fields: 'files(id, name, createdTime)',
    spaces: 'drive',
  });

  return response.data.files;
}

export async function downloadPDF(driveClient: any, fileId: string) {
  const response = await driveClient.files.get(
    { fileId, alt: 'media' },
    { responseType: 'arraybuffer' }
  );
  return Buffer.from(response.data);
}