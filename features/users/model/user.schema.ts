import { z } from 'zod';

export const userRoleSchema = z.enum(['admin', 'operator']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
  status: z.string().optional(),
  lastLogin: z.string().optional(),
  createdAt: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;

// Request Schemas
export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: userRoleSchema,
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  role: userRoleSchema.optional(),
});

export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
