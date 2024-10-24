"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
import { FolderList } from "@/components/folder-list";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function FoldersPage() {
  const { data: session } = useSession();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch("/api/folders");
        const data = await response.json();
        setFolders(data.folders);
      } catch (error) {
        console.error("Error fetching folders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchFolders();
    }
  }, [session]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-6 h-6" />
            Select Google Drive Folder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FolderList folders={folders} />
        </CardContent>
      </Card>
    </div>
  );
}