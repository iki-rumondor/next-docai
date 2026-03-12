"use client";
import {
  LayoutDashboard,
  Upload,
  Cpu,
  FileText,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/jobs", label: "Processing Jobs", icon: Cpu },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
];

const TopNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    toast.success("Logged out", {
      description: "You have been signed out.",
    });
    router.push("/login");
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
            {navItems.map((item) => {
              const isActive =
                item.to === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.to);
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
                    U
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
