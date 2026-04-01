import { Clock, Cpu, CreditCard, Zap, FileText } from "lucide-react";
import { ProcessingTime, AiUsage } from "../model/documents.schema";

interface DocumentMetricsProps {
    processingTime?: ProcessingTime;
    aiUsage?: AiUsage;
}

export const DocumentMetrics = ({ processingTime, aiUsage }: DocumentMetricsProps) => {
    if (!processingTime && !aiUsage) return null;

    return (
        <div className="space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Processing & AI Usage
            </h4>
            
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {processingTime && (
                    <div className="rounded-xl bg-muted/40 p-4 border border-border/20">
                        <div className="flex items-center gap-2 mb-1.5 font-medium text-muted-foreground uppercase tracking-wide">
                            <Clock className="w-3.5 h-3.5 text-primary/70" />
                            <span className="text-[10px]">Processing</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">
                            {processingTime.duration_sec.toFixed(2)}s
                        </p>
                    </div>
                )}

                {aiUsage && (
                    <>
                        <div className="rounded-xl bg-muted/40 p-4 border border-border/20">
                            <div className="flex items-center gap-2 mb-1.5 font-medium text-muted-foreground uppercase tracking-wide">
                                <Cpu className="w-3.5 h-3.5 text-blue-500/70" />
                                <span className="text-[10px]">Model</span>
                            </div>
                            <p className="text-[13px] font-bold text-foreground truncate" title={aiUsage.model}>
                                {aiUsage.model.split('-').slice(-2).join('-').toUpperCase() || aiUsage.model}
                            </p>
                        </div>

                        <div className="rounded-xl bg-muted/40 p-4 border border-border/20">
                            <div className="flex items-center gap-2 mb-1.5 font-medium text-muted-foreground uppercase tracking-wide">
                                <Zap className="w-3.5 h-3.5 text-amber-500/70" />
                                <span className="text-[10px]">Tokens</span>
                            </div>
                            <p className="text-sm font-bold text-foreground">
                                {(aiUsage.total_tokens / 1000).toFixed(1)}k
                            </p>
                        </div>

                        <div className="rounded-xl bg-muted/40 p-4 border border-border/20">
                            <div className="flex items-center gap-2 mb-1.5 font-medium text-muted-foreground uppercase tracking-wide">
                                <CreditCard className="w-3.5 h-3.5 text-emerald-500/70" />
                                <span className="text-[10px]">Cost</span>
                            </div>
                            <p className="text-sm font-bold text-foreground">
                                ${parseFloat(aiUsage.total_price).toFixed(4)}
                            </p>
                        </div>

                        <div className="rounded-xl bg-muted/40 p-4 border border-border/20">
                            <div className="flex items-center gap-2 mb-1.5 font-medium text-muted-foreground uppercase tracking-wide">
                                <FileText className="w-3.5 h-3.5 text-indigo-500/70" />
                                <span className="text-[10px]">Pages</span>
                            </div>
                            <p className="text-sm font-bold text-foreground">
                                {aiUsage.total_pages}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
