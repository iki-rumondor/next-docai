export const FILE_STATUSES = [
  'uploaded',
  'processing',
  'completed',
  'failed',
  'pending_review',
] as const;

export type FileStatus = (typeof FILE_STATUSES)[number];

export const FILE_STATUS_CONFIG: Record<FileStatus, { label: string; color: string }> = {
  uploaded: { 
    label: "Uploaded", 
    color: "badge-blue" 
  },
  processing: { 
    label: "Processing", 
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
  pending_review: { 
    label: "Pending Review", 
    color: "badge-yellow" 
  },
};
