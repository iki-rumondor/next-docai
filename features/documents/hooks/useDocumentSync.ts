import { useQueryClient } from "@tanstack/react-query";
import { useSSE } from "@/shared/hooks/use-sse";
import { ApiResponse } from "@/shared/types/api-response";
import { Document } from "../model/documents.schema";
import { getCookie } from "@/shared/lib/cookies";

/**
 * Hook to sync document status and progress via SSE.
 * This is used to listen to the document's backend stream and 
 * update the document's status field in the React Query cache.
 */

export const useDocumentSync = (documentId: string | null) => {
  const queryClient = useQueryClient();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const streamUrl = (documentId && baseUrl) 
    ? `${baseUrl}/documents/${documentId}/stream` 
    : null;

/*
  useSSE(streamUrl, {
    onMessage: (data: { status: string }) => {
      // In-place update for React Query cache to avoid full refetch
      queryClient.setQueryData<ApiResponse<Document>>(['documents', documentId], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            status: data.status,
          },
        };
      });
      
      // Also invalidate the list to reflect updates across the app if needed
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    enabled: !!documentId,
    token: getCookie('auth_token'),
  });
*/
};
