'use client';
import { useState } from 'react'
import { Clock, FileText, Layers, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { RetryModal } from '@/shared/components/RetryModal';
import { Progress } from '@/shared/components/ui/progress';
import { useDocuments, DocumentCard, Document } from '@/features/documents';
import { SourceFile } from '../model/files.schema';
import { useFiles } from '../hooks/useFiles';

export const DetailFileContainer = ({ job }: { job: SourceFile }) => {
    const { useDocumentsList } = useDocuments({ source_file_id: job.id });
    const { data: documentsData, isLoading } = useDocumentsList();
    const { retry: retryFile, isRetrying: isRetryingFile } = useFiles();
    
    const [retryOpen, setRetryOpen] = useState(false);
    const hasFailedPages = job.status === "failed";

    const handleRetryFile = () => {
        retryFile(job.id, {
            onSuccess: () => {
                setRetryOpen(false);
            }
        });
    };

    const documents = documentsData?.data?.items || [];

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

                {job.status === "processing" && (
                    <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-muted-foreground italic">Processing file...</span>
                            <span className="text-primary">{Math.round(job.progress)}%</span>
                        </div>
                        <Progress value={job.progress} className="h-1.5" />
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                    Detected Documents ({isLoading ? "..." : documents.length})
                </h2>
                
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-24 w-full rounded-2xl bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : documents.length > 0 ? (
                    <div className="space-y-3">
                        {documents.map((doc: Document) => (
                            <DocumentCard key={doc.id} document={doc} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
                        No documents detected yet.
                    </div>
                )}
            </div>

            <RetryModal
                open={retryOpen}
                onOpenChange={setRetryOpen}
                title="Retry Failed Pages"
                description={`This will re-process all failed pages in ${job.fileName}. Are you sure?`}
                onConfirm={handleRetryFile}
                isLoading={isRetryingFile}
            />
        </>
    )
}
