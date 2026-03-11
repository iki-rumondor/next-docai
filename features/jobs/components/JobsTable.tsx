'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Job } from "@/data/mockData";
import { StatusBadge } from "@/shared/components/StatusBadge";

interface JobsTableProps {
    jobs: Job[];
    compact?: boolean;
}

export const JobsTable = ({ jobs, compact = false }: JobsTableProps) => {
    const router = useRouter();

    return (
        <div className="rounded-2xl border border-border/50 bg-card shadow-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/50">
                        <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4 px-5">Job ID</TableHead>
                        <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4">File Name</TableHead>
                        <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4">Pages</TableHead>
                        <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4">Status</TableHead>
                        <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4">Progress</TableHead>
                        <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4">Created</TableHead>
                        <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4 px-5 text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {jobs.map((job, idx) => (
                        <TableRow
                            key={job.id}
                            className={`cursor-pointer transition-colors duration-150 hover:bg-accent/40 ${idx !== jobs.length - 1 ? "border-b border-border/30" : ""
                                }`}
                            onClick={() => router.push(`/jobs/${job.id}`)}
                        >
                            <TableCell className="font-mono text-[13px] font-medium py-4 px-5">{job.id}</TableCell>
                            <TableCell className="font-medium text-[13px] max-w-55 truncate py-4">{job.fileName}</TableCell>
                            <TableCell className="text-[13px] text-muted-foreground py-4">{job.pages}</TableCell>
                            <TableCell className="py-4"><StatusBadge status={job.status} /></TableCell>
                            <TableCell className="min-w-35 py-4">
                                <div className="flex items-center gap-3">
                                    <Progress value={job.progress} className="h-1.5 flex-1" />
                                    <span className="text-[11px] font-medium text-muted-foreground w-8 tabular-nums">{job.progress}%</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-[13px] text-muted-foreground py-4">{job.createdAt}</TableCell>
                            <TableCell className="text-right py-4 px-5">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-foreground rounded-xl"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/jobs/${job.id}`);
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
        </div>
    );
};


