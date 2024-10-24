import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";

interface FolderListProps {
  folders: Array<{
    id: string;
    name: string;
    createdAt: string;
  }>;
}

export function FolderList({ folders }: FolderListProps) {
  const handleFolderSelect = async (folderId: string) => {
    try {
      await fetch("/api/folders/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderId }),
      });
      window.location.href = "/pdfs";
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  };

  return (
    <div className="grid gap-4">
      {folders.map((folder) => (
        <Button
          key={folder.id}
          variant="outline"
          className="w-full justify-start gap-2 h-auto py-4"
          onClick={() => handleFolderSelect(folder.id)}
        >
          <Folder className="w-5 h-5" />
          <div className="flex flex-col items-start">
            <span className="font-medium">{folder.name}</span>
            <span className="text-sm text-muted-foreground">
              Created: {new Date(folder.createdAt).toLocaleDateString()}
            </span>
          </div>
        </Button>
      ))}
    </div>
  );
}