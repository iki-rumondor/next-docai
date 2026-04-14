import { useState } from "react";
import { ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { RetryModal } from "@/shared/components/RetryModal";
import { Document } from "@/shared/types";

interface InstanceCardProps {
    instance: Document;
}

export const InstanceCard = ({ instance }: InstanceCardProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [retryOpen, setRetryOpen] = useState(false);

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
                            <p className="text-sm font-semibold text-foreground">{instance.document_type?.name || "Unknown Document"}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{instance.vendor?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={instance.status} />
                        {instance.status === "failed" && (
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
                        <div>
                            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                                Extracted Fields
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {instance.fields?.map((field) => (
                                    <div key={field.key} className="rounded-xl bg-muted/40 p-4">
                                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{field.key}</p>
                                        <p className="text-sm font-semibold text-foreground mt-1">{field.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {instance.items && instance.items.length > 0 && (
                            <div>
                                <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                                    Line Items
                                </h4>
                                <div className="rounded-xl border border-border/50 overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                                {Object.keys(instance.items[0]).map((key) => (
                                                    <TableHead key={key} className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground py-3">
                                                        {key}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {instance.items.map((item, idx) => (
                                                <TableRow key={idx} className="hover:bg-accent/30 border-b border-border/30 last:border-0">
                                                    {Object.values(item).map((val, vIdx) => (
                                                        <TableCell key={vIdx} className="text-[13px] py-3.5">
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
                title={`Retry ${instance.document_type?.name || 'Document'}`}
                description={`This will re-process the ${instance.document_type?.name || 'document'} from ${instance.vendor?.name || 'the vendor'}. Are you sure?`}
            />
        </>
    );
};

export default InstanceCard;
