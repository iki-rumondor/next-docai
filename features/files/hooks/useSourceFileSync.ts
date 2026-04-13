// import { useQueryClient } from "@tanstack/react-query";
// import { useSSE } from "@/shared/hooks/use-sse";
// import { ApiResponse } from "@/shared/types/api-response";
// import { SourceFile, SourceFileStatus } from "../model/files.schema";
// import { getCookie } from "@/shared/lib/cookies";

/**
 * Hook to sync source file (job) status and progress via Server-Sent Events (SSE).
 */
export const useSourceFileSync = (fileId: string | null) => {
  // const queryClient = useQueryClient();
  // const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  // const token = getCookie('auth_token');

  // SSE Implementation
/*
  const { isConnected } = useSSE<{
    status: string;
    progress?: number;
    message?: string;
    error_message?: string;
    processing_time?: SourceFile['processing_time'];
    ai_usage?: SourceFile['ai_usage'];
  }>(
    fileId ? `${baseUrl}/source-files/${fileId}/stream` : null,
    {
      token: token || undefined,
      onMessage: (data) => {
        console.log(`[SSE Debug] 🔄 Received update for ${fileId}:`, data);
        
        const status = data.status as SourceFileStatus;
        const progress = data.progress;

        // Update cache React Query
        queryClient.setQueryData<ApiResponse<SourceFile>>(['source-files', fileId], (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              status,
              ...(progress !== undefined ? { progress } : {}),
              ...(data.processing_time ? { processing_time: data.processing_time } : {}),
              ...(data.ai_usage ? { ai_usage: data.ai_usage } : {}),
            },
          };
        });

        // Invalidate list if status changed to final
        if (['completed', 'failed'].includes(status)) {
          queryClient.invalidateQueries({ queryKey: ["source-files"] });
          if (status === 'completed') {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
          }
        }
      },
      onError: (err) => {
        console.error(`[SSE Debug] ❌ Error for ${fileId}:`, err);
      },
      onOpen: () => {
        console.log(`[SSE Debug] 👍 Connected for ${fileId}`);
      }
    }
  );
*/

  return { isConnected: false };
};
