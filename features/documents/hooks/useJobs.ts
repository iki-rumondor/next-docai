"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsService } from "../api/jobs.service";
import { toast } from "sonner";
import { ApiError } from "@/shared/lib/api-error";
import { mockSocketService } from "@/shared/lib/mock-socket";

export const useJobs = () => {
  const queryClient = useQueryClient();
  const isMock = process.env.NEXT_PUBLIC_MOCK_API === "true";
  const { simulateJobProgress } = mockSocketService(queryClient) || {};

  const retryJobMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          data: { id, status: "queued", progress: 0 },
          meta: { success: true, message: "Job retry triggered (Mock)" },
        };
      }
      return jobsService.retry(id);
    },
    onSuccess: (res, jobId) => {
      // Invalidate documents to show updated status
      queryClient.invalidateQueries({ queryKey: ["documents"] });

      if (isMock && simulateJobProgress) {
        // In mock, we don't have docId easily here, but simulateJobProgress
        // in my mock-socket.ts can handle by jobId too if we match it.
        simulateJobProgress(jobId, "");
      }

      const message = res.meta.message || "Job retry triggered successfully";
      toast.success(message);
    },
    onError: (err: ApiError) => {
      toast.error("Failed to retry job", { description: err.message });
    },
  });

  return {
    retryJob: retryJobMutation.mutate,
    isRetrying: retryJobMutation.isPending,
  };
};
