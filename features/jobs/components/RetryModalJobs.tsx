'use client';
import { useState } from 'react'
import { Clock, FileText, Layers, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { InstanceCard } from '@/features/dashboard';
import { RetryModal } from './RetryModal';
import { Job, mockInstances } from '@/data/mockData';

export const RetryModalJobs = ({ job }: { job: Job }) => {
    const [retryOpen, setRetryOpen] = useState(false);
    const hasFailedPages = job.status === "failed";
    return (
        <>
            <div className="rounded-xl border border-border/60 bg-card shadow-card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground">{job.fileName}</h1>
                                <p className="text-sm text-muted-foreground font-mono">{job.id}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" /> {job.createdAt}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Layers className="h-3.5 w-3.5" /> {job.pages} pages
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <StatusBadge status={job.status} />
                        {hasFailedPages && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl"
                                onClick={() => setRetryOpen(true)}
                            >
                                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Retry Failed Pages
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                    Detected Document Instances ({mockInstances.length})
                </h2>
                <div className="space-y-3">
                    {mockInstances.map((instance) => (
                        <InstanceCard key={instance.id} instance={instance} />
                    ))}
                </div>
            </div>

            <RetryModal
                open={retryOpen}
                onOpenChange={setRetryOpen}
                title="Retry Failed Pages"
                description={`This will re-process all failed pages in ${job.fileName}. Are you sure?`}
            />
        </>
    )
}
