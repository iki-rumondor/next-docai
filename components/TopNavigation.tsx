'use client';
import { LayoutDashboard, Upload, Cpu, FileText, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/upload", label: "Upload", icon: Upload },
    { to: "/jobs", label: "Processing Jobs", icon: Cpu },
    { to: "/documents", label: "Documents", icon: FileText },
    { to: "/settings", label: "Settings", icon: Settings },
];

const TopNavigation = () => {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full pt-5 pb-3 px-6">
            <div className="mx-auto max-w-7xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
                        <Cpu className="h-4.5 w-4.5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold text-foreground tracking-tight">DocAI</span>
                </div>

                <nav className="bg-nav rounded-2xl shadow-elevated border border-border/40 px-2 py-2 flex items-center gap-0.5">
                    {navItems.map((item) => {
                        const isActive =
                            item.to === "/"
                                ? pathname === "/"
                                : pathname.startsWith(item.to);

                        return (
                            <Link
                                key={item.to}
                                href={item.to}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${isActive
                                        ? "bg-nav-active text-nav-active-foreground shadow-md"
                                        : "text-nav-foreground hover:text-foreground hover:bg-accent/60"
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                <span className="hidden md:inline">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="w-24" />
            </div>
        </header >
    );
};

export default TopNavigation;