import { Card, CardContent } from "@/shared/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    variant?: "default" | "primary" | "success" | "warning" | "destructive" | "info";
}

const iconStyles = {
    default: "bg-secondary text-secondary-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
    info: "bg-info/10 text-info",
};

export const StatCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) => {
    return (
        <Card className="bg-card shadow-card border-border/50 rounded-2xl animate-fade-in hover:shadow-elevated transition-shadow duration-300">
            <CardContent className="px-7 py-2">
                <div className="flex items-start justify-between">
                    <div className="space-y-3">
                        <p className="text-[13px] font-medium text-muted-foreground">{title}</p>
                        <p className="text-4xl font-extrabold text-card-foreground tracking-tight">{value}</p>
                        {trend && (
                            <p className="text-xs font-medium text-success">{trend}</p>
                        )}
                    </div>
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${iconStyles[variant]}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
