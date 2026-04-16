"use client";

import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useState, useEffect } from "react";
import { useDebounce } from "@/shared/hooks";
import {
  FILE_STATUS_CONFIG,
  FILE_STATUSES,
} from "@/shared/constants/file-status";
import { FilesTable, useFiles } from "@/features/files";

export default function FilesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  const { useFileList } = useFiles();
  const { data: fileData, isLoading } = useFileList({
    status: statusFilter === "all" ? undefined : statusFilter,
    page: page,
    limit: 10,
    search: debouncedSearch || undefined,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
  });

  // Reset pagination when status filter or search changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter, debouncedSearch, startDate, endDate]);

  const jobs = fileData?.data || [];
  const pagination = fileData?.pagination;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Files</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and manage all document files
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by file name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl h-10 bg-card shadow-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <span className="text-xs font-medium text-muted-foreground w-16 lg:w-auto text-right">Status:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-[150px] rounded-lg h-9 bg-card shadow-sm">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="all">All Statuses</SelectItem>
                  {FILE_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {FILE_STATUS_CONFIG[status].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="hidden lg:block w-[1px] h-6 bg-border mx-1"></div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
              <span className="text-xs font-medium text-muted-foreground w-16 lg:w-auto text-right">Range:</span>
              <div className="flex items-center gap-2 flex-1">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 lg:w-[140px] rounded-lg h-9 bg-card text-xs shadow-sm"
                  title="Start Date"
                />
                <span className="text-muted-foreground text-xs font-medium">-</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 lg:w-[140px] rounded-lg h-9 bg-card text-xs shadow-sm"
                  title="End Date"
                />
              </div>
            </div>
          </div>

          {(statusFilter !== "all" || startDate || endDate || search) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-all rounded-lg"
              onClick={() => {
                setStatusFilter("all");
                setStartDate("");
                setEndDate("");
                setSearch("");
              }}
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <FilesTable
        jobs={jobs}
        pagination={pagination}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </div>
  );
}
