import { z } from 'zod';
import { sourceFileSchema } from '@/features/files/model/files.schema';

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

export const documentSchema = z.object({
  id: z.string(),
  job_id: z.string().optional(),
  source_file: sourceFileSchema.optional(),
  document_type: documentTypeSchema.optional(),
  vendor: vendorSchema.optional(),
  start_page: z.number().optional(),
  end_page: z.number().optional(),
  status: z.string().optional(),
  progress: z.number().optional(),
  fields: z.array(documentFieldSchema).optional(),
  items: z.array(documentItemSchema).optional(),
});

export type Document = z.infer<typeof documentSchema>;

export const listDocumentsQuerySchema = z.object({
  source_file_id: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type ListDocumentsQuery = z.infer<typeof listDocumentsQuerySchema>;
