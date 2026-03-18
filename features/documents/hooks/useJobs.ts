import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsService } from "../api/jobs.service";
import { toast } from "sonner";
import { ApiError } from "@/shared/lib/api-error";

export const useJobs = () => {
  const queryClient = useQueryClient();

  const retryJobMutation = useMutation({
    mutationFn: (id: string) => jobsService.retry(id),
    onSuccess: (res) => {
      // Invalidate queries to show updated status
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["files"] });

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
