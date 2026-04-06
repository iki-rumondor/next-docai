export const DOCUMENT_STATUSES = [
  'queue',
  'processing',
  'completed',
  'failed',
  'pending_review',
] as const;

export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export const DOCUMENT_STATUS_CONFIG: Record<DocumentStatus, { label: string; color: string }> = {
  queue: {
    label: "Queue", 
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
