import { z } from "zod";
import { FILE_STATUSES } from "../../../shared/constants/file-status";

export const sourceFileStatusSchema = z.enum(FILE_STATUSES);

export type SourceFileStatus = z.infer<typeof sourceFileStatusSchema>;

export const sourceFileSchema = z.object({
  id: z.string(),
  file_name: z.string(),
  file_path: z.string(),
  mime_type: z.string(),
  page_count: z.number(),
  status: sourceFileStatusSchema,
  progress: z.number(),
  error_message: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  processing_duration: z.number().optional(),
  processing_time: z
    .object({
      started_at: z.string().nullable(),
      completed_at: z.string().nullable(),
      duration_ms: z.number().nullable(),
      duration_sec: z.number().nullable(),
    })
    .optional(),
  ai_usage: z
    .object({
      model: z.string().nullable(),
      prompt_tokens: z.number(),
      output_tokens: z.number(),
      total_tokens: z.number(),
      cheap_model_price: z.number(),
      flagship_model_price: z.number(),
      total_price: z.number(),
    })
    .optional(),
  uploaded_by: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
});

export type SourceFile = z.infer<typeof sourceFileSchema>;

// Request Schemas
export const uploadFileSchema = z.object({
  file: z.any(), // File object in browser
  pages: z.string().optional(),
});

export type UploadFileRequest = z.infer<typeof uploadFileSchema>;

export const listFilesQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export type ListFilesQuery = z.infer<typeof listFilesQuerySchema>;

/**
 * Specifically for the List Files API as requested by user
 */
export interface ListFilesData {
  data: SourceFile[];
  pagination: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}
