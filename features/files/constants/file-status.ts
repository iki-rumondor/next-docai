export const FILE_STATUSES = [
  'uploaded',
  'queued',
  'processing',
  'extracting',
  'completed',
  'failed',
] as const;

export type FileStatus = (typeof FILE_STATUSES)[number];

export const FILE_STATUS_CONFIG: Record<FileStatus, { label: string; color: string }> = {
  uploaded: { 
    label: "Uploaded", 
    color: "badge-blue" 
  },
  queued: { 
    label: "Queued", 
    color: "badge-yellow" 
  },
  processing: { 
    label: "Processing", 
    color: "badge-blue" 
  },
  extracting: { 
    label: "Extracting", 
    color: "badge-blue" 
  },
  completed: { 
    label: "Completed", 
    color: "badge-green" 
  },
  failed: { 
    label: "Failed", 
    color: "badge-red" 
  },
};
