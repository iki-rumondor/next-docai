"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AddUser, UsersTable } from "@/features/users";
import { useAuth } from "@/features/auth";
import { Loader2 } from "lucide-react";

const UserManagementPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user && user.role !== "admin") {
      router.push("/");
    }
  }, [mounted, user, router]);
  
  if (!mounted || !user || user.role !== "admin") {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage user roles, system access, and accounts
          </p>
        </div>
        <AddUser />
      </div>

      <div className="rounded-2xl border border-border/50 bg-card shadow-card overflow-hidden">
        <UsersTable />
      </div>
    </div>
  );
};

export default UserManagementPage;
