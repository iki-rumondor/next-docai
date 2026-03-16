'use client';

import { useState } from "react";
import { ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { StatusBadge, Status } from "@/shared/components/StatusBadge";
import { RetryModal } from "@/shared/components/RetryModal";
import { Progress } from "@/shared/components/ui/progress";
import { Document } from "../model/documents.schema";
import { useJobs } from "../hooks/useJobs";

interface DocumentCardProps {
    document: Document;
}

export const DocumentCard = ({ document }: DocumentCardProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [retryOpen, setRetryOpen] = useState(false);
    const { retryJob, isRetrying } = useJobs();

    const handleRetryConfirm = () => {
        if (document.job_id) {
            retryJob(document.job_id, {
                onSuccess: () => {
                    setRetryOpen(false);
                }
            });
        }
    };

    const documentType = document.document_type?.name || "Unknown Document";
    const vendor = document.vendor?.name || "Unknown Vendor";
    const status = document.status || "queued";

    return (
        <>
            <div className="rounded-2xl border border-border/50 bg-card shadow-card overflow-hidden animate-fade-in">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-6 hover:bg-accent/30 transition-colors duration-150 cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center">
                            {isOpen ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-foreground">{documentType}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{vendor} • Pages {document.start_page}-{document.end_page}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={status as Status} />
                        {status === "failed" && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary rounded-xl"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setRetryOpen(true);
                                }}
                            >
                                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                Retry
                            </Button>
                        )}
                    </div>
                </div>

                {status === "extracting" && (
                    <div className="px-6 pb-6 space-y-2">
                        <div className="flex justify-between text-[10px] font-medium">
                            <span className="text-muted-foreground italic uppercase tracking-wider">Extracting data...</span>
                            <span className="text-primary">{Math.round(document.progress || 0)}%</span>
                        </div>
                        <Progress value={document.progress} className="h-1" color="primary" />
                    </div>
                )}

                {isOpen && (
                    <div className="border-t border-border/40 p-6 space-y-6">
                        {document.fields && document.fields.length > 0 && (
                            <div>
                                <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                                    Extracted Fields
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {document.fields.map((field, idx) => (
                                        <div key={idx} className="rounded-xl bg-muted/40 p-4">
                                            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{field.key}</p>
                                            <p className="text-sm font-semibold text-foreground mt-1">{field.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {document.items && document.items.length > 0 && (
                            <div>
                                <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                                    Line Items
                                </h4>
                                <div className="rounded-xl border border-border/50 overflow-hidden overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                                {Object.keys(document.items[0]).map((key) => (
                                                    <TableHead key={key} className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground py-3">
                                                        {key}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {document.items.map((item, idx) => (
                                                <TableRow key={idx} className="hover:bg-accent/30 border-b border-border/30 last:border-0">
                                                    {Object.values(item).map((val, vIdx) => (
                                                        <TableCell key={vIdx} className="text-[13px] py-3.5 whitespace-nowrap">
                                                            {String(val)}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <RetryModal
                open={retryOpen}
                onOpenChange={setRetryOpen}
                title={`Retry ${documentType}`}
                description={`This will re-process the ${documentType} from ${vendor}. Are you sure?`}
                onConfirm={handleRetryConfirm}
                isLoading={isRetrying}
            />
        </>
    );
};
