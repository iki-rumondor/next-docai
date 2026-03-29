'use client';

import { useState } from "react";
import { ChevronDown, ChevronRight, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { StatusBadge, Status } from "@/shared/components/StatusBadge";
import { RetryModal } from "@/shared/components/RetryModal";
import { JsonViewer } from "./JsonViewer";
import { Document } from "../model/documents.schema";
import { useDocuments } from "../hooks/useDocuments";
import { useJobs } from "../hooks/useJobs";
import { useDocumentSync } from "../hooks/useDocumentSync";

interface DocumentCardProps {
    document: Document;
}

export const DocumentCard = ({ document }: DocumentCardProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [retryOpen, setRetryOpen] = useState(false);
    const [activeView, setActiveView] = useState<'visual' | 'json'>('visual');
    
    const { useDocumentDetail } = useDocuments();
    const { data: detailResponse, isLoading: isDetailLoading } = useDocumentDetail(isOpen ? document.id : "");
    const { retryJob, isRetrying } = useJobs();
    
    // Sync document status via SSE
    useDocumentSync(document.id);

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
    
    // Use detail data if available, otherwise fallback to list data
    const fullDocument = detailResponse?.data || document;
    const fields = fullDocument.fields || [];
    const items = fullDocument.items || [];

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


                {isOpen && (
                    <div className="border-t border-border/40 p-6 space-y-6">
                        {isDetailLoading ? (
                            <div className="flex flex-col items-center justify-center py-10 space-y-3">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                <p className="text-xs text-muted-foreground">Fetching full document details...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-xl w-fit mb-4">
                                    <Button
                                        variant={activeView === 'visual' ? 'secondary' : 'ghost'}
                                        size="sm"
                                        className="rounded-lg h-8 text-xs px-3"
                                        onClick={() => setActiveView('visual')}
                                    >
                                        Visual Data
                                    </Button>
                                    <Button
                                        variant={activeView === 'json' ? 'secondary' : 'ghost'}
                                        size="sm"
                                        className="rounded-lg h-8 text-xs px-3"
                                        onClick={() => setActiveView('json')}
                                    >
                                        Raw JSON
                                    </Button>
                                </div>

                                {activeView === 'visual' ? (
                                    <>
                                        {fields.length > 0 ? (
                                            <div>
                                                <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                                                    Extracted Fields
                                                </h4>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {fields.map((field, idx) => (
                                                        <div key={idx} className="rounded-xl bg-muted/40 p-4">
                                                            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{field.key}</p>
                                                            <p className="text-sm font-semibold text-foreground mt-1">{field.value || "-"}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-2 text-sm text-muted-foreground italic">No fields extracted for this document.</div>
                                        )}

                                        {items.length > 0 && (
                                            <div>
                                                <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4 mt-6">
                                                    Line Items
                                                </h4>
                                                <div className="rounded-xl border border-border/50 overflow-hidden overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                                                {Object.keys(items[0]).map((key) => (
                                                                    <TableHead key={key} className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground py-3">
                                                                        {key}
                                                                    </TableHead>
                                                                ))}
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {items.map((item, idx) => (
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
                                    </>
                                ) : (
                                    <JsonViewer data={fullDocument} title={`${documentType} Payload`} />
                                )}
                            </>
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
