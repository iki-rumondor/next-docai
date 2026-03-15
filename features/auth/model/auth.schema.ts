import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | string;
}

export interface LoginResponse {
  meta: {
    success: boolean;
    message: string;
  };
  data: {
    token: string;
    user: AuthUser;
  };
}
