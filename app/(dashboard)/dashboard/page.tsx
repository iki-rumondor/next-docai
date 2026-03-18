'use client';

import { FilesTable, useFiles } from "@/features/files";
import { StatCard } from "@/shared/components/StatCard";
import { AlertTriangle, CheckCircle, Cpu, FileCheck, Info, Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { useFileList } = useFiles();
    
    // Fetch jobs for different statuses to get counts
    const { data: processingData, isLoading: isProcessingLoading } = useFileList({ status: 'processing' });
    const { data: completedData } = useFileList({ status: 'completed' });
    const { data: failedData } = useFileList({ status: 'failed' });
    
    const processingJobs = processingData?.data?.data || [];
    const processingCount = processingData?.data?.pagination.total || 0;
    const completedCount = completedData?.data?.pagination.total || 0;
    const failedCount = failedData?.data?.pagination.total || 0;

    return (
        <div className="space-y-10 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1.5">Operational overview of document processing</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Processed Today"
                    value={completedCount + failedCount}
                    icon={FileCheck}
                    trend="+12% from yesterday"
                    variant="primary"
                />
                <StatCard
                    title="Currently Processing"
                    value={processingCount}
                    icon={Cpu}
                    variant="info"
                />
                <StatCard
                    title="Completed Jobs"
                    value={completedCount}
                    icon={CheckCircle}
                    variant="success"
                />
                <StatCard
                    title="Failed Jobs"
                    value={failedCount}
                    icon={AlertTriangle}
                    variant="destructive"
                />
            </div>

            <div>
                <h2 className="text-lg font-semibold text-foreground mb-5">Files in Processing</h2>
                {isProcessingLoading ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-muted/5 border border-border/40 rounded-2xl text-center">
                        <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
                        <p className="text-sm text-muted-foreground">Updating processing status...</p>
                    </div>
                ) : processingJobs.length > 0 ? (
                    <FilesTable jobs={processingJobs} compact />
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 bg-muted/20 border border-dashed border-border rounded-2xl text-center">
                        <div className="h-12 w-12 rounded-full bg-muted/10 flex items-center justify-center mb-4">
                            <Info className="h-6 w-6 text-muted-foreground/60" />
                        </div>
                        <h3 className="text-sm font-medium text-foreground">No files in processing</h3>
                        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">All document processing tasks have been completed.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
