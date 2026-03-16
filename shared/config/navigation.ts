import {
  LayoutDashboard,
  Upload,
  Cpu,
  Users,
  User,
} from "lucide-react";

export const NAVIGATION_CONFIG = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/files", label: "Files", icon: Cpu },
  { to: "/users", label: "Users", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export type NavItem = typeof NAVIGATION_CONFIG[number];
