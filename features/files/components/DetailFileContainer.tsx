'use client';
import { useState } from 'react'
import { AlertCircle, Clock, FileText, Layers, RotateCcw, Timer, Zap } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { RetryModal } from '@/shared/components/RetryModal';
import { Progress } from '@/shared/components/ui/progress';
import { useDocuments, DocumentCard, Document, JsonViewer } from '@/features/documents';
import { SourceFile } from '../model/files.schema';
import { useFiles } from '../hooks/useFiles';
// import { useSourceFileSync } from '../hooks/useSourceFileSync';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { formatDate } from '@/shared/lib/utils';
import { DOCUMENT_STATUS_CONFIG, DOCUMENT_STATUSES } from '../constants/document-status';

export const DetailFileContainer = ({ job }: { job: SourceFile }) => {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<string>("all");
    
    const { useDocumentsList } = useDocuments({ 
        source_file_id: job.id,
        page,
        limit: 10,
        status: status === "all" ? undefined : status
    });
    const { data: documentsData, isLoading } = useDocumentsList();
    const { retry: retryFile, isRetrying: isRetryingFile } = useFiles();
    
    // Sync file progress/status via SSE
    // useSourceFileSync(job.id);
    
    const [retryOpen, setRetryOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'documents' | 'json'>('documents');
    const hasFailedPages = job.status === "failed";

    const handleRetryFile = () => {
        retryFile(job.id, {
            onSuccess: () => {
                setRetryOpen(false);
            }
        });
    };

    const parseErrorMessage = (errorMsg: string | null) => {
        if (!errorMsg) return "An unknown error occurred processing this file.";
        try {
            const parsed = JSON.parse(errorMsg);
            return parsed.error?.message || parsed.message || errorMsg;
        } catch {
            return errorMsg;
        }
    };

    const formatDuration = (seconds?: number) => {
        if (seconds === undefined || seconds === null) return null;
        if (seconds < 60) return `${seconds.toFixed(1)}s`;
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}m ${s}s`;
    };

    const documents = documentsData?.data?.data || [];

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
                                <h1 className="text-xl font-bold text-foreground">{job.file_name}</h1>
                                <p className="text-sm text-muted-foreground font-mono">{job.id}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" /> {formatDate(job.created_at)}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Layers className="h-3.5 w-3.5" /> {job.page_count} pages
                            </span>
                            {(job.status === "completed" || job.status === "failed") && (job.processing_duration !== undefined || job.processing_time?.duration_sec !== undefined) && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="flex items-center gap-1.5 text-primary cursor-help bg-primary/5 px-2 py-0.5 rounded-md border border-primary/20">
                                            <Timer className="h-3.5 w-3.5" /> {formatDuration(job.processing_time ? job.processing_time.duration_sec : job.processing_duration)}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Processing Time Total
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            {job.pricing && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="flex items-center gap-1.5 text-orange-600 font-bold cursor-help bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                                            <Zap className="h-3.5 w-3.5" /> ${job.pricing.total_price.toFixed(5)}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        AI Usage (Smart + Cheap Models)
                                    </TooltipContent>
                                </Tooltip>
                            )}
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

                {job.status === "failed" && job.error_message && (
                    <div className="mt-6 p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-destructive animate-fade-in">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                            <div className="space-y-1">
                                <p className="text-sm font-bold">Processing Failed</p>
                                <p className="text-sm opacity-90 leading-relaxed italic border-l-2 border-destructive/20 pl-3 py-1">
                                    {parseErrorMessage(job.error_message)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-xl w-fit">
                        <Button
                            variant={activeTab === 'documents' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="rounded-lg h-9 text-sm px-4"
                            onClick={() => setActiveTab('documents')}
                        >
                            Detected Documents ({isLoading ? "..." : documentsData?.data?.pagination?.total || 0})
                        </Button>
                        <Button
                            variant={activeTab === 'json' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="rounded-lg h-9 text-sm px-4"
                            onClick={() => setActiveTab('json')}
                        >
                            File Payload (JSON)
                        </Button>
                    </div>

                    {activeTab === 'documents' && (
                        <div className="flex items-center gap-2">
                            <Select value={status} onValueChange={(val) => {
                                setStatus(val);
                                setPage(1);
                            }}>
                                <SelectTrigger className="h-9 w-[160px] rounded-xl bg-card">
                                    <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                  <SelectItem value="all">All Status</SelectItem>
                                    {DOCUMENT_STATUSES.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {DOCUMENT_STATUS_CONFIG[s].label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                
                {activeTab === 'documents' ? (
                    <>
                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-24 w-full rounded-2xl bg-muted animate-pulse" />
                                ))}
                            </div>
                        ) : documents.length > 0 ? (
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    {documents.map((doc: Document) => (
                                        <DocumentCard key={doc.id} document={doc} />
                                    ))}
                                </div>
                                
                                {documentsData?.data?.pagination && documentsData.data.pagination.total_pages > 1 && (
                                    <div className="flex items-center justify-between px-2 py-2">
                                        <p className="text-[13px] text-muted-foreground">
                                            Page <span className="font-medium text-foreground">{page}</span> of <span className="font-medium text-foreground">{documentsData.data.pagination.total_pages}</span>
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 rounded-lg"
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                disabled={page <= 1}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 rounded-lg"
                                                onClick={() => setPage(p => Math.min(documentsData.data.pagination.total_pages, p + 1))}
                                                disabled={page >= documentsData.data.pagination.total_pages}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
                                No documents detected {status !== "all" ? `with status "${status}"` : "yet"}.
                            </div>
                        )}
                    </>
                ) : (
                    <JsonViewer data={job} title={`File ${job.file_name} RAW Content`} />
                )}
            </div>

            <RetryModal
                open={retryOpen}
                onOpenChange={setRetryOpen}
                title="Retry Failed Pages"
                description={`This will re-process all failed pages in ${job.file_name}. Are you sure?`}
                onConfirm={handleRetryFile}
                isLoading={isRetryingFile}
            />
        </>
    )
}
