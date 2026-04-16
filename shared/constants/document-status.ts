export const DOCUMENT_STATUSES = [
  'queued',
  'processing',
  'completed',
  'failed',
  'pending_review',
  'extracting',
] as const;

export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export const DOCUMENT_STATUS_CONFIG: Record<DocumentStatus, { label: string; color: string }> = {
  extracting: {
    label: "Extracting", 
    color: "badge-yellow" 
  },
  queued: {
    label: "Queued", 
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
