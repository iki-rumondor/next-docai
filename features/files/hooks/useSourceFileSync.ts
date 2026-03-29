import { useQueryClient } from "@tanstack/react-query";
import { useSSE } from "@/shared/hooks/use-sse";
import { ApiResponse } from "@/shared/types/api-response";
import { SourceFile, SourceFileStatus } from "../model/files.schema";
import { getCookie } from "@/shared/lib/cookies";

/**
 * Hook to sync source file (job) status and progress via SSE.
 */
export const useSourceFileSync = (fileId: string | null) => {
  const queryClient = useQueryClient();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const streamUrl = (fileId && baseUrl) 
    ? `${baseUrl}/source-files/${fileId}/stream` 
    : null;

  useSSE(streamUrl, {
    onMessage: (data: { status: string; progress: number }) => {
      // Update individual file detail cache
      queryClient.setQueryData<ApiResponse<SourceFile>>(['source-files', fileId], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            status: data.status as SourceFileStatus,
            progress: data.progress,
          },
        };
      });

      // Also invalidate the list to reflect updates in the table
      queryClient.invalidateQueries({ queryKey: ["source-files"] });
      
      // If completed, also invalidate documents as they might be ready
      if (data.status === 'completed') {
        queryClient.invalidateQueries({ queryKey: ["documents"] });
      }
    },
    enabled: !!fileId,
    token: getCookie('auth_token'),
  });
};
