'use client';

import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { FILE_STATUS_CONFIG, FILE_STATUSES } from "@/features/files/constants/file-status";
import { FilesTable, useFiles, SourceFile } from "@/features/files";

export default function FilesPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const { useFileList } = useFiles();
    const { data: fileData, isLoading } = useFileList({ 
        status: statusFilter === "all" ? undefined : statusFilter 
    });

    const filteredJobs = useMemo(() => {
        const jobs = fileData?.data.data || [];
        return jobs.filter((job: SourceFile) => {
            const matchesSearch =
                job.file_name.toLowerCase().includes(search.toLowerCase()) ||
                job.id.toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });
    }, [fileData, search]);

    if (isLoading) return <div className="text-center py-20">Loading files...</div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Files</h1>
                <p className="text-muted-foreground mt-1">Monitor and manage all document files</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by file name or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 rounded-xl h-10 bg-card"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px] rounded-xl h-10 bg-card">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Statuses</SelectItem>
                        {FILE_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                                {FILE_STATUS_CONFIG[status].label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {filteredJobs.length > 0 ? (
                <FilesTable jobs={filteredJobs} />
            ) : (
                <div className="text-center py-16 rounded-xl border border-border/60 bg-card shadow-card">
                    <p className="text-muted-foreground">No files found matching your filters.</p>
                </div>
            )}
        </div>
    )
}
