"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Cpu, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth";
import { NAVIGATION_CONFIG } from "@/shared/config/navigation";

const TopNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [userName, setUserName] = useState("U");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("user_info");
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          if (user.name) {
            const initial = user.name[0].toUpperCase();
            // eslint-disable-next-line
            setUserName(initial);
          }
        } catch (e) {
          console.error("Failed to parse user_info", e);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full pt-5 pb-3 px-6">
      <div className="mx-auto max-w-7xl">
        <nav className="bg-nav rounded-2xl shadow-elevated border border-border/40 px-3 py-2 flex items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Cpu className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground tracking-tight hidden sm:inline">
              DocAI
            </span>
          </div>

          {/* Nav Links - centered */}
          <div className="flex-1 flex items-center justify-center gap-0.5">
            {NAVIGATION_CONFIG.map((item) => {
              const isActive =
                pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-nav-active text-nav-active-foreground shadow-md"
                      : "text-nav-foreground hover:text-foreground hover:bg-accent/60"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Profile Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {userName}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 mt-1">
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};

export default TopNavigation;
