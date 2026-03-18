"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "../api/auth.service";
import { AuthUser, LoginRequest, LoginResponse } from "../model/auth.schema";
import { setCookie, deleteCookie } from "@/shared/lib/cookies";
import { ApiError } from "@/shared/lib/api-error";

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("user_info");
      if (userInfo) {
        try {
          return JSON.parse(userInfo);
        } catch (e) {
          console.error("Failed to parse user info", e);
        }
      }
    }
    return null;
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (response: LoginResponse) => {
      if (response.meta.success) {
        // Store tokens
        setCookie("auth_token", response.data.token);
        setCookie("refresh_token", response.data.refreshToken);
        
        // Store user info
        localStorage.setItem("user_info", JSON.stringify(response.data.user));
        setUser(response.data.user);

        toast.success(response.meta.message || "Login successful");
        router.push("/dashboard");
      } else {
        toast.error(response.meta.message || "Login failed");
      }
    },
    onError: (error: ApiError) => {
      toast.error("Login Error", { description: error.message });
    },
  });

  const logout = () => {
    deleteCookie("auth_token");
    deleteCookie("refresh_token");
    localStorage.removeItem("user_info");
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const updateUser = (newUser: AuthUser) => {
    localStorage.setItem("user_info", JSON.stringify(newUser));
    setUser(newUser);
  };

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    logout,
    user,
    updateUser,
  };
};
