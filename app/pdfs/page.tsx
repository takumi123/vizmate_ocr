"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { PDFList } from "@/components/pdf-list";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";

export default function PDFsPage() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const response = await fetch("/api/pdfs");
        const data = await response.json();
        setPdfs(data.pdfs);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPDFs();
  }, []);

  const handleExportCSV = async () => {
    try {
      const response = await fetch("/api/export/csv");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ocr-results.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">PDF Documents</h1>
        <Button onClick={handleExportCSV} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            PDF Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PDFList pdfs={pdfs} />
        </CardContent>
      </Card>
    </div>
  );
}