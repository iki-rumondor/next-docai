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
    total_items: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export const FilesTable = ({
  jobs,
  compact = false,
  pagination,
  onPageChange,
  isLoading = false,
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
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={`skeleton-${i}`} className="border-b border-border/30 last:border-0">
                <TableCell className="py-5 px-4">
                  <div className="h-4 w-32 bg-muted rounded-md animate-pulse" />
                </TableCell>
                <TableCell className="py-5 px-4">
                  <div className="h-4 w-8 bg-muted rounded-md animate-pulse" />
                </TableCell>
                <TableCell className="py-5 px-4">
                  <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                </TableCell>
                <TableCell className="py-5 px-4">
                  <div className="h-2 w-24 bg-muted rounded-full animate-pulse" />
                </TableCell>
                <TableCell className="py-5 px-4">
                  <div className="h-4 w-24 bg-muted rounded-md animate-pulse" />
                </TableCell>
                <TableCell className="py-5 px-5 flex justify-end">
                  <div className="h-8 w-16 bg-muted rounded-xl animate-pulse" />
                </TableCell>
              </TableRow>
            ))
          ) : jobs.length > 0 ? (
            jobs.map((job, idx) => (
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="py-20 text-center">
                <p className="text-muted-foreground text-sm">
                  No files found matching your filters.
                </p>
              </TableCell>
            </TableRow>
          )}
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
              {Math.min(pagination.page * pagination.limit, pagination.total_items)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {pagination.total_items}
            </span>{" "}
            files
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 lg:flex rounded-lg"
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              disabled={!pagination.has_prev_page}
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
              disabled={!pagination.has_next_page}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
