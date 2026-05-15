"use client";

import { useState, useEffect, useCallback } from 'react';
import { filesService } from '../api/files.service';
import { toast } from 'sonner';

export const useFileView = (filePath?: string, fileName?: string) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFile = useCallback(async () => {
    if (!filePath) return;

    try {
      setIsLoading(true);
      setError(null);
      const blob = await filesService.getFileBlob(filePath);
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
    } catch (err: unknown) {
      console.error('Failed to load file blob', err);
      const message = err instanceof Error ? err.message : 'Failed to load file preview';
      setError(message);
      toast.error('Preview Error', { description: 'Could not load the file preview. It might be missing or you lack permissions.' });
    } finally {
      setIsLoading(false);
    }
  }, [filePath]);

  const download = useCallback(async () => {
    if (!filePath) return;

    try {
      const blob = await filesService.getFileBlob(filePath);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || filePath.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not download the file.';
      toast.error('Download Failed', { description: message });
    }
  }, [filePath, fileName]);

  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  return {
    blobUrl,
    isLoading,
    error,
    loadPreview: getFile,
    download,
  };
};
