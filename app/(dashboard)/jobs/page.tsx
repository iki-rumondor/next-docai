'use client';

import JobsTable from "@/components/JobsTable";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockJobs } from "@/data/mockData";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function ProcessingJobsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const filteredJobs = useMemo(() => {
        return mockJobs.filter((job) => {
            const matchesSearch =
                job.fileName.toLowerCase().includes(search.toLowerCase()) ||
                job.id.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "all" || job.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Processing Jobs</h1>
                <p className="text-muted-foreground mt-1">Monitor and manage all document processing jobs</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by file name or job ID..."
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
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="queued">Queued</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {filteredJobs.length > 0 ? (
                <JobsTable jobs={filteredJobs} />
            ) : (
                <div className="text-center py-16 rounded-xl border border-border/60 bg-card shadow-card">
                    <p className="text-muted-foreground">No jobs found matching your filters.</p>
                </div>
            )}
        </div>
    )
}
