import { Badge } from "@/components/ui/badge";

type Status = "completed" | "processing" | "queued" | "failed";

const statusConfig: Record<Status, { label: string; color: string; }> = {
    completed: { label: "Completed", color: "badge-green" },
    processing: { label: "Processing", color: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
    queued: { label: "Queued", color: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" },
    failed: { label: "Failed", color: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" },
};

interface StatusBadgeProps {
    status: Status;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
    const config = statusConfig[status];
    return <Badge variant='outline' className={`${config.color}`}> {config.label}</ Badge >;
};

export default StatusBadge;
export type { Status };
