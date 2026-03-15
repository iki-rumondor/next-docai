import { z } from 'zod';

export const jobStatusSchema = z.enum(['queued', 'extracting', 'completed', 'failed']);
export type JobStatus = z.infer<typeof jobStatusSchema>;

export const jobSchema = z.object({
  id: z.string(),
  document_id: z.string(),
  status: jobStatusSchema,
  progress: z.number(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

export type Job = z.infer<typeof jobSchema>;
