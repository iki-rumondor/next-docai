"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { SourceFile } from "@/features/files";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { formatDate } from "@/shared/lib/utils";

interface FilesTableProps {
  jobs: SourceFile[];
  compact?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  onPageChange?: (page: number) => void;
}

export const FilesTable = ({
  jobs,
  compact = false,
  pagination,
  onPageChange,
}: FilesTableProps) => {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-border/50 bg-card shadow-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/50">
            <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4">
              File Name
            </TableHead>
            <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4">
              Pages
            </TableHead>
            <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4">
              Status
            </TableHead>
            <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4">
              Progress
            </TableHead>
            <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4">
              Created
            </TableHead>
            <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4 px-5 text-right">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job, idx) => (
            <TableRow
              key={job.id}
              className={`cursor-pointer transition-colors duration-150 hover:bg-accent/40 ${
                idx !== jobs.length - 1 ? "border-b border-border/30" : ""
              }`}
              onClick={() => router.push(`/files/${job.id}`)}
            >
              <TableCell className="font-medium text-[13px] max-w-55 truncate py-4">
                {job.file_name}
              </TableCell>
              <TableCell className="text-[13px] text-muted-foreground py-4">
                {job.page_count}
              </TableCell>
              <TableCell className="py-4">
                <StatusBadge status={job.status} />
              </TableCell>
              <TableCell className="min-w-[140px] py-4">
                <div className="flex items-center gap-3">
                  <Progress value={job.progress} className="h-1.5 flex-1" />
                  <span className="text-[11px] font-medium text-muted-foreground w-8 tabular-nums">
                    {Math.round(job.progress)}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-[13px] text-muted-foreground py-4">
                {formatDate(job.created_at)}
              </TableCell>
              <TableCell className="text-right py-4 px-5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/files/${job.id}`);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1.5" />
                  {!compact && "Details"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-muted/10">
          <p className="text-[13px] text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {pagination.total}
            </span>{" "}
            files
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 lg:flex rounded-lg"
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-[13px] font-medium px-2">
              Page {pagination.page}{" "}
              <span className="text-muted-foreground font-normal">
                of {pagination.total_pages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 lg:flex rounded-lg"
              onClick={() => onPageChange && onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.total_pages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
