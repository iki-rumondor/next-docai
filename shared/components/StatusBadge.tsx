import { Badge } from "@/shared/components/ui/badge";
import { FILE_STATUS_CONFIG, FileStatus } from "@/features/files/constants/file-status";

interface StatusBadgeProps {
    status: FileStatus | string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const config = FILE_STATUS_CONFIG[status as FileStatus] || { label: status, color: "bg-gray-100 text-gray-800" };
    return <Badge variant='outline' className={`${config.color}`}> {config.label}</ Badge >;
};

export type { FileStatus as Status };
