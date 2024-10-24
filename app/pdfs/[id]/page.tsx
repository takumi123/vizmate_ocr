"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { PDFViewer } from "@/components/pdf-viewer";
import { useToast } from "@/components/ui/use-toast";

export default function PDFDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [ocrResult, setOcrResult] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOCRResult = async () => {
      try {
        const response = await fetch(`/api/ocr/${params.id}`);
        const data = await response.json();
        setOcrResult(data.content);
      } catch (error) {
        console.error("Error fetching OCR result:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOCRResult();
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/ocr/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: ocrResult }),
      });
      toast({
        title: "Success",
        description: "OCR result saved successfully",
      });
    } catch (error) {
      console.error("Error saving OCR result:", error);
      toast({
        title: "Error",
        description: "Failed to save OCR result",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/pdfs")}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to List
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/pdfs/${Number(params.id) - 1}`)}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/pdfs/${Number(params.id) + 1}`)}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <Textarea
              value={ocrResult}
              onChange={(e) => setOcrResult(e.target.value)}
              className="min-h-[600px] font-mono"
              placeholder="OCR Result"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <PDFViewer pdfId={params.id as string} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}