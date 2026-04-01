import { z } from 'zod';

export const vendorSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Vendor = z.infer<typeof vendorSchema>;

export const documentTypeSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
});

export type DocumentType = z.infer<typeof documentTypeSchema>;

export const documentFieldSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export type DocumentField = z.infer<typeof documentFieldSchema>;

// Dynamic structure for line items
export const documentItemSchema = z.record(z.string(), z.any());

export type DocumentItem = z.infer<typeof documentItemSchema>;

export const processingTimeSchema = z.object({
  started_at: z.string(),
  completed_at: z.string(),
  duration_ms: z.number(),
  duration_sec: z.number(),
});

export type ProcessingTime = z.infer<typeof processingTimeSchema>;

export const aiUsageSchema = z.object({
  model: z.string(),
  prompt_tokens: z.number(),
  output_tokens: z.number(),
  total_tokens: z.number(),
  input_price: z.string(),
  output_price: z.string(),
  total_price: z.string(),
  total_pages: z.number(),
  duration_ms: z.number(),
  duration_sec: z.number(),
});

export type AiUsage = z.infer<typeof aiUsageSchema>;


export const documentSchema = z.object({
  id: z.string(),
  job_id: z.string(),
  source_file: z.object({
    id: z.string(),
    file_name: z.string(),
  }).optional(),
  document_type: documentTypeSchema.optional(),
  vendor: vendorSchema.optional(),
  start_page: z.number(),
  end_page: z.number(),
  status: z.string(),
  confidence: z.string().optional(),
  needs_review: z.boolean().optional(),
  error_message: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),
  fields: z.array(documentFieldSchema).optional(),
  items: z.array(documentItemSchema).optional(),
  processing_time: processingTimeSchema.optional(),
  ai_usage: aiUsageSchema.optional(),
});

export type Document = z.infer<typeof documentSchema>;

export const listDocumentsQuerySchema = z.object({
  source_file_id: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
  status: z.string().optional(),
});

export type ListDocumentsQuery = z.infer<typeof listDocumentsQuerySchema>;

/**
 * Specifically for the List Documents API as requested by user
 */
export interface ListDocumentsData {
  data: Document[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
