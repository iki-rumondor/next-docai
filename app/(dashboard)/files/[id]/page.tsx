'use client';

import { BackButton } from "@/shared/components/BackButton";
import { DetailFileContainer } from "@/features/files";
import { useFiles } from "@/features/files/hooks/useFiles";
import { use } from "react";
import { Loader2 } from "lucide-react";

export default function DetailFilesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { useFileDetail } = useFiles();
  const { data: fileData, isLoading, error } = useFileDetail(id);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !fileData?.data) {
    return (
      <div className="space-y-6">
        <BackButton href="/files" label="Back to Files" />
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
          <p className="font-semibold">Error Loading File</p>
          <p className="text-sm mt-1">{(error as Error)?.message || "File not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <BackButton href="/files" label="Back to Files" />
      <DetailFileContainer job={fileData.data} />
    </div>
  );
}
