import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { documentsService } from "../api/documents.service";
import { ListDocumentsQuery } from "../model/documents.schema";
import { toast } from "sonner";
import { ApiError } from "@/shared/lib/api-error";

export const useDocumentTypes = () => {
  return useQuery({
    queryKey: ["document-types"],
    queryFn: () => documentsService.getDocumentTypes(),
  });
};

export const useDocumentsList = (query?: ListDocumentsQuery) => {
  return useQuery({
    queryKey: ["documents", query],
    queryFn: () => documentsService.list(query),
  });
};

export const useDocumentDetail = (id: string) => {
  return useQuery({
    queryKey: ["documents", id],
    queryFn: () => documentsService.getById(id),
    enabled: !!id,
  });
};

export const useDocumentRaw = (id: string) => {
  return useQuery({
    queryKey: ["documents", id, "raw"],
    queryFn: () => documentsService.getRawById(id),
    enabled: !!id,
  });
};

export const useDocumentRetry = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (id: string) => documentsService.retry(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      const message = res.meta?.message || "Document retry triggered";
      toast.success(message);
    },
    onError: (err: ApiError) => {
      toast.error("Retry failed", { description: err.message });
    },
  });

  return {
    retry: mutation.mutate,
    isRetrying: mutation.isPending,
  };
};
