'use client';

import { FilesTable, useFiles } from "@/features/files";
import { DashboardStats } from "@/features/dashboard";
import { Info, Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { useFileList } = useFiles();
    
    // Fetch only the processing jobs for the list
    const { data: processingData, isLoading: isProcessingLoading } = useFileList({ status: 'processing' });
    
    const processingJobs = processingData?.data || [];

    return (
        <div className="space-y-10 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1.5">Operational overview of document processing</p>
            </div>

            <DashboardStats />

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
