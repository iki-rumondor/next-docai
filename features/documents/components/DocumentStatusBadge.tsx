import { Badge } from "@/shared/components/ui/badge";
import { DOCUMENT_STATUS_CONFIG, DocumentStatus } from "@/shared/constants/document-status";

interface DocumentStatusBadgeProps {
  status: DocumentStatus | string;
}

export const DocumentStatusBadge = ({ status }: DocumentStatusBadgeProps) => {
  const config = DOCUMENT_STATUS_CONFIG[status as DocumentStatus] || {
    label: status,
    color: "bg-gray-100 text-gray-800",
  };
  return (
    <Badge variant="outline" className={`${config.color}`}>
      {config.label}
    </Badge>
  );
};
