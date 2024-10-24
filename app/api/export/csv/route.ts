import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: Request) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Mock CSV data - Replace with actual implementation
  const csvContent = "Document Name,OCR Content\nDocument1.pdf,Sample content 1\nDocument2.pdf,Sample content 2";

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=ocr-results.csv",
    },
  });
}