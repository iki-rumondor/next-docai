import {
  LayoutDashboard,
  Upload,
  Cpu,
  Settings,
} from "lucide-react";

export const NAVIGATION_CONFIG = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/files", label: "Files", icon: Cpu },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export type NavItem = typeof NAVIGATION_CONFIG[number];
