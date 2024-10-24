"use client";

interface PDFViewerProps {
  pdfId: string;
}

export function PDFViewer({ pdfId }: PDFViewerProps) {
  return (
    <iframe
      src={`/api/pdfs/${pdfId}/view`}
      className="w-full h-[600px] border-0"
      title="PDF Viewer"
    />
  );
}