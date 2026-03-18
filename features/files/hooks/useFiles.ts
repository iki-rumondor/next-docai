"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { filesService } from "../api/files.service";
import { ListFilesQuery } from "../model/files.schema";
import { toast } from "sonner";
import { ApiError } from "@/shared/lib/api-error";

export const useFiles = () => {
  const queryClient = useQueryClient();

  const useFileList = (query?: ListFilesQuery) => {
    return useQuery({
      queryKey: ["source-files", query],
      queryFn: () => filesService.list(query),
    });
  };

  const useFileDetail = (id: string) => {
    return useQuery({
      queryKey: ["source-files", id],
      queryFn: () => filesService.getById(id),
      enabled: !!id,
    });
  };

  const retryMutation = useMutation({
    mutationFn: (id: string) => filesService.retry(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["source-files"] });
      const message = res.meta?.message || "Retry triggered";
      toast.success(message);
    },
    onError: (err: ApiError) => {
      toast.error("Retry failed", { description: err.message });
    },
  });

  return {
    useFileList,
    useFileDetail,
    retry: retryMutation.mutate,
    isRetrying: retryMutation.isPending,
  };
};
