import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { OCRProcessor } from "@/lib/ocr-processor";
import { getGoogleDriveClient, downloadPDF } from "@/lib/google-drive";
import { kv } from "@vercel/kv";

const ocrProcessor = new OCRProcessor();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if OCR result exists
    const existingResult = await ocrProcessor.getResult(params.id);
    if (existingResult) {
      return NextResponse.json({ content: existingResult });
    }

    // If no result exists, process the PDF
    const driveClient = await getGoogleDriveClient(req);
    const pdfBuffer = await downloadPDF(driveClient, params.id);
    
    // Update status to processing
    await kv.set(`pdf:${params.id}:status`, 'processing');
    
    // Process PDF and get OCR result
    const content = await ocrProcessor.processPDF(pdfBuffer, params.id);
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error processing OCR:", error);
    return NextResponse.json(
      { error: "Failed to process OCR" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();
    await ocrProcessor.updateResult(params.id, content);

    return NextResponse.json({ message: "OCR result updated successfully" });
  } catch (error) {
    console.error("Error updating OCR result:", error);
    return NextResponse.json(
      { error: "Failed to update OCR result" },
      { status: 500 }
    );
  }
}