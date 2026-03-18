"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadService } from "../api/upload.service";
import { toast } from "sonner";
import { ApiError } from "@/shared/lib/api-error";

export const useUpload = () => {
  const queryClient = useQueryClient();
  const isMock = process.env.NEXT_PUBLIC_MOCK_API === "true";

  const uploadMutation = useMutation({
    mutationFn: async ({ file, pages }: { file: File; pages?: string }) => {
      if (isMock) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return {
          data: {
            id: `JOB-${Math.floor(Math.random() * 1000)}`,
            fileName: file.name,
            pages: 10,
            status: "queued" as const,
            progress: 0,
            createdAt: new Date().toISOString(),
          },
          meta: { success: true, message: "File uploaded successfully (Mock)" },
        };
      }
      return uploadService.upload(file, pages);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["source-files"] });
      const message = res.meta.message || "Upload successful";
      toast.success(message);
    },
    onError: (err: ApiError) => {
      toast.error("Upload failed", { description: err.message });
    },
  });

  return {
    upload: uploadMutation.mutate,
    uploadAsync: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    error: uploadMutation.error,
    isSuccess: uploadMutation.isSuccess,
  };
};
