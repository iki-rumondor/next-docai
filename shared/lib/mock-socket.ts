'use client';

import { QueryClient } from '@tanstack/react-query';

// Simulation of a server-side business process
// That sends "file.updated" or "job.updated" events via WebSocket.
// This mock service should be used ONLY when process.env.NEXT_PUBLIC_MOCK_API === 'true'

export const mockSocketService = (queryClient: QueryClient) => {
  const isMock = process.env.NEXT_PUBLIC_MOCK_API === 'true';
  if (!isMock) return;

  console.log('📡 [MockSocket] Simulation Service Started');

  // Simulation: File progress update
  const simulateFileProgress = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }

      console.log(`📡 [MockSocket] file.updated ${fileId} progress: ${progress}%`);

      // 1. Update the Detail Query cache
      queryClient.setQueryData(['source-files', fileId], (old: unknown) => {
        if (!old) return old;
        const typedOld = old as { data: Record<string, unknown> };
        const newStatus = progress === 100 ? 'completed' : 'processing';
        return {
          ...typedOld,
          data: { ...typedOld.data, progress, status: newStatus }
        };
      });

      // 2. Refresh the List Query cache
      queryClient.invalidateQueries({ queryKey: ['source-files'] });
    }, 2000);
  };

  // Simulation: Document extraction job update
  const simulateJobProgress = (jobId: string, docId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }

      console.log(`📡 [MockSocket] job.updated ${jobId} progress: ${progress}%`);

      // Update ALL document lists cache for the UI to react
      queryClient.setQueriesData({ queryKey: ['documents'] }, (old: unknown) => {
        if (!old) return old;
        const typedOld = old as { data: { items: Array<Record<string, unknown>> } };
        
        // If it's a list response
        if (typedOld.data?.items) {
          const items = typedOld.data.items.map((doc) => {
            if (doc.id === docId || doc.job_id === jobId || (jobId && doc.job_id === jobId)) {
              return {
                ...doc,
                status: progress === 100 ? 'completed' : 'extracting',
                progress,
              };
            }
            return doc;
          });

          return {
            ...typedOld,
            data: { ...typedOld.data, items }
          };
        }

        // If it's a detail response (direct data object)
        const detailData = old as { data: Record<string, unknown> };
        if (detailData.data?.id === docId || detailData.data?.job_id === jobId) {
          return {
            ...detailData,
            data: {
              ...detailData.data,
              status: progress === 100 ? 'completed' : 'extracting',
              progress,
            }
          };
        }

        return old;
      });
    }, 1500);
  };

  return {
    simulateFileProgress,
    simulateJobProgress,
  };
};
