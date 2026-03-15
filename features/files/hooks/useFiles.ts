'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { filesService } from '../api/files.service';
import { ListFilesQuery, SourceFile } from '../model/files.schema';
import { toast } from 'sonner';
import { mockJobs } from '@/data/mockData';

import { ApiError } from '@/shared/lib/api-error';
import { SourceFileStatus } from '../model/files.schema';

// Helper to convert mockJobs to SourceFile type if needed
const mapMockToSourceFile = (job: typeof mockJobs[0]): SourceFile => ({
  id: job.id,
  fileName: job.fileName,
  pages: job.pages,
  status: job.status as SourceFileStatus,
  progress: job.progress,
  createdAt: job.createdAt,
  updatedAt: job.createdAt,
});

export const useFiles = () => {
  const queryClient = useQueryClient();
  const isMock = process.env.NEXT_PUBLIC_MOCK_API === 'true';

  const useFileList = (query?: ListFilesQuery) => {
    return useQuery({
      queryKey: ['source-files', query],
      queryFn: async () => {
        if (isMock) {
          await new Promise(resolve => setTimeout(resolve, 800));
          let filtered = [...mockJobs];
          if (query?.status && query.status !== 'all') {
            filtered = filtered.filter(j => j.status === query.status);
          }
          
          return {
            data: {
              items: filtered.map(mapMockToSourceFile),
              total: filtered.length,
              page: query?.page || 1,
              limit: query?.limit || 10,
              totalPages: 1
            },
            meta: { success: true }
          };
        }
        return filesService.list(query);
      },
    });
  };

  const useFileDetail = (id: string) => {
    return useQuery({
      queryKey: ['source-files', id],
      queryFn: async () => {
        if (isMock) {
          await new Promise(resolve => setTimeout(resolve, 500));
          const file = mockJobs.find(j => j.id === id);
          if (!file) throw new Error('File not found');
          return {
            data: mapMockToSourceFile(file),
            meta: { success: true }
          };
        }
        return filesService.getById(id);
      },
      enabled: !!id,
    });
  };

  const uploadMutation = useMutation({
    mutationFn: async ({ file, pages }: { file: File, pages?: string }) => {
      if (isMock) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
          data: {
            id: `JOB-${Math.floor(Math.random() * 1000)}`,
            fileName: file.name,
            pages: 10,
            status: 'queued' as const,
            progress: 0,
            createdAt: new Date().toISOString(),
          },
          meta: { success: true, message: 'File uploaded successfully (Mock)' }
        };
      }
      return filesService.upload(file, pages);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['source-files'] });
      const message = res.meta.message || 'Upload successful';
      toast.success(message);
    },
    onError: (err: ApiError) => {
      toast.error('Upload failed', { description: err.message });
    }
  });

  const retryMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isMock) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          data: { id, status: 'processing' },
          meta: { success: true, message: 'Retry triggered (Mock)' }
        };
      }
      return filesService.retry(id);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['source-files'] });
      const message = res.meta.message || 'Retry triggered';
      toast.success(message);
    },
    onError: (err: ApiError) => {
      toast.error('Retry failed', { description: err.message });
    }
  });

  return {
    useFileList,
    useFileDetail,
    upload: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    retry: retryMutation.mutate,
    isRetrying: retryMutation.isPending,
  };
};
