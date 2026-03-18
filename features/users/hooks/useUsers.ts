"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../api/users.service";
import {
  CreateUserRequest,
  UpdateUserRequest,
  User,
} from "../model/user.schema";
import { toast } from "sonner";
import { ApiError } from "@/shared/lib/api-error";

// Mock Data
const mockUsers: User[] = [
  {
    id: "USR-001",
    name: "Admin Utama",
    email: "admin@docai.com",
    role: "admin",
    status: "active",
    lastLogin: "2026-03-15 10:00",
  },
  {
    id: "USR-002",
    name: "Operator Satu",
    email: "operator1@docai.com",
    role: "operator",
    status: "active",
    lastLogin: "2026-03-14 15:30",
  },
  {
    id: "USR-003",
    name: "Operator Dua",
    email: "operator2@docai.com",
    role: "operator",
    status: "inactive",
    lastLogin: "2026-03-10 09:45",
  },
];

export const useUsers = () => {
  const queryClient = useQueryClient();
  const isMock = process.env.NEXT_PUBLIC_MOCK_API === "true";

  const useUsersList = () => {
    return useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        if (isMock) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          return {
            data: mockUsers,
            meta: { success: true },
          };
        }
        return usersService.list();
      },
    });
  };

  const useUserDetail = (id: string) => {
    return useQuery({
      queryKey: ["users", id],
      queryFn: async () => {
        if (isMock) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const user = mockUsers.find((u) => u.id === id);
          if (!user) throw new Error("User not found");
          return {
            data: user,
            meta: { success: true },
          };
        }
        return usersService.getById(id);
      },
      enabled: !!id,
    });
  };

  const createMutation = useMutation({
    mutationFn: async (payload: CreateUserRequest) => {
      if (isMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          data: {
            id: `USR-${Math.floor(Math.random() * 1000)}`,
            ...payload,
            status: "active",
            lastLogin: "-",
          },
          meta: { success: true, message: "User created successfully (Mock)" },
        };
      }
      return usersService.create(payload);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(res.meta.message || "User created");
    },
    onError: (err: ApiError) => {
      toast.error("Failed to create user", { description: err.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateUserRequest;
    }) => {
      if (isMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          data: { id, ...payload },
          meta: { success: true, message: "User updated successfully (Mock)" },
        };
      }
      return usersService.update(id, payload);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(res.meta.message || "User updated");
    },
    onError: (err: ApiError) => {
      toast.error("Failed to update user", { description: err.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isMock) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return;
      }
      return usersService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (err: ApiError) => {
      toast.error("Failed to delete user", { description: err.message });
    },
  });

  return {
    useUsersList,
    useUserDetail,
    create: createMutation.mutate,
    isCreating: createMutation.isPending,
    update: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    delete: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
