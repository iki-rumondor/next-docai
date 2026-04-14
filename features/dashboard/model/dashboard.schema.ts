import { z } from 'zod';

export const DashboardStatsSchema = z.object({
  processed_today: z.object({
    count: z.number(),
    percentage_change: z.number(),
  }),
  currently_processing: z.object({
    count: z.number(),
  }),
  completed_jobs: z.object({
    count: z.number(),
  }),
  failed_jobs: z.object({
    count: z.number(),
  }),
});

export type DashboardStatsData = z.infer<typeof DashboardStatsSchema>;
