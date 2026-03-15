'use client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '../api/auth.service';
import { LoginRequest, LoginResponse } from '../model/auth.schema';
import { setCookie, deleteCookie } from '@/shared/lib/cookies';
import { ApiError } from '@/shared/lib/api-error';

export const useAuth = () => {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      // MOCK IMPLEMENTATION - Remove this when API is ready
      if (process.env.NEXT_PUBLIC_MOCK_API === 'true') {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
        
        if (credentials.email === 'operator@example.com' && credentials.password === 'password123') {
          return {
            meta: { success: true, message: 'Mock login successful' },
            data: {
              token: 'mock-jwt-token-' + Date.now(),
              user: {
                id: '1',
                name: 'Operator DocAI',
                email: credentials.email,
                role: 'operator'
              }
            }
          } as LoginResponse;
        }
        throw new Error('Invalid mock credentials');
      }
      
      // REAL API CALL
      return authService.login(credentials);
    },
    onSuccess: (response: LoginResponse) => {
      if (response.meta.success) {
        // Store token in cookie for middleware and API requests
        setCookie('auth_token', response.data.token);
        // Store user info in localStorage for client-side access
        localStorage.setItem('user_info', JSON.stringify(response.data.user));
        
        toast.success(response.meta.message || 'Login successful');
        router.push('/dashboard');
      } else {
        toast.error(response.meta.message || 'Login failed');
      }
    },
    onError: (error: ApiError) => {
      toast.error('Login Error', { description: error.message });
    },
  });

  const logout = () => {
    deleteCookie('auth_token');
    localStorage.removeItem('user_info');
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    logout,
  };
};
