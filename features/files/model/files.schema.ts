import { z } from 'zod';

export const sourceFileStatusSchema = z.enum([
  'queued',
  'processing',
  'completed',
  'failed',
]);

export type SourceFileStatus = z.infer<typeof sourceFileStatusSchema>;

export const sourceFileSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  pages: z.number(),
  status: sourceFileStatusSchema,
  progress: z.number(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
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
});

export type ListFilesQuery = z.infer<typeof listFilesQuerySchema>;
