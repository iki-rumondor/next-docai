import { FilesTable } from "@/features/files";
import { StatCard } from "@/shared/components/StatCard";
import { mockJobs } from "@/data/mockData";
import { AlertTriangle, CheckCircle, Cpu, FileCheck, Info } from "lucide-react";

export default function DashboardPage() {
    const processingJobs = mockJobs.filter(job => job.status === 'processing');

    return (
        <div className="space-y-10 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1.5">Operational overview of document processing</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Processed Today"
                    value={142}
                    icon={FileCheck}
                    trend="+12% from yesterday"
                    variant="primary"
                />
                <StatCard
                    title="Currently Processing"
                    value={processingJobs.length}
                    icon={Cpu}
                    variant="info"
                />
                <StatCard
                    title="Completed Jobs"
                    value={mockJobs.filter(j => j.status === 'completed').length}
                    icon={CheckCircle}
                    variant="success"
                />
                <StatCard
                    title="Failed Jobs"
                    value={mockJobs.filter(j => j.status === 'failed').length}
                    icon={AlertTriangle}
                    variant="destructive"
                />
            </div>

            <div>
                <h2 className="text-lg font-semibold text-foreground mb-5">Files in Processing</h2>
                {processingJobs.length > 0 ? (
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
