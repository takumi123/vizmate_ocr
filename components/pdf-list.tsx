import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface PDFListProps {
  pdfs: Array<{
    id: string;
    name: string;
    uploadedAt: string;
    status: string;
  }>;
}

export function PDFList({ pdfs }: PDFListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "processing":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="grid gap-4">
      {pdfs.map((pdf) => (
        <Link key={pdf.id} href={`/pdfs/${pdf.id}`}>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-auto py-4"
          >
            <FileText className="w-5 h-5" />
            <div className="flex flex-col items-start flex-1">
              <span className="font-medium">{pdf.name}</span>
              <span className="text-sm text-muted-foreground">
                Uploaded: {new Date(pdf.uploadedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(pdf.status)}
              <span className="text-sm capitalize">{pdf.status}</span>
            </div>
          </Button>
        </Link>
      ))}
    </div>
  );
}