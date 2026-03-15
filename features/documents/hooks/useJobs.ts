'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsService } from '../api/jobs.service';
import { toast } from 'sonner';
import { ApiError } from '@/shared/lib/api-error';

export const useJobs = () => {
    const queryClient = useQueryClient();
    const isMock = process.env.NEXT_PUBLIC_MOCK_API === 'true';

    const retryJobMutation = useMutation({
        mutationFn: async (id: string) => {
            if (isMock) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return {
                    data: { id, status: 'queued', progress: 0 },
                    meta: { success: true, message: 'Job retry triggered (Mock)' }
                };
            }
            return jobsService.retry(id);
        },
        onSuccess: (res) => {
            // Invalidate documents to show updated status
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            const message = res.meta.message || 'Job retry triggered successfully';
            toast.success(message);
        },
        onError: (err: ApiError) => {
            toast.error('Failed to retry job', { description: err.message });
        }
    });

    return {
        retryJob: retryJobMutation.mutate,
        isRetrying: retryJobMutation.isPending,
    };
};
