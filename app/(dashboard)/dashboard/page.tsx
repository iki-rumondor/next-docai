import { JobsTable } from "@/features/jobs";
import { StatCard } from "@/shared/components/StatCard";
import { mockJobs } from "@/data/mockData";
import { AlertTriangle, CheckCircle, Cpu, FileCheck } from "lucide-react";

export default function DashboardPage() {
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
                    value={3}
                    icon={Cpu}
                    variant="info"
                />
                <StatCard
                    title="Completed Jobs"
                    value={89}
                    icon={CheckCircle}
                    variant="success"
                />
                <StatCard
                    title="Failed Jobs"
                    value={2}
                    icon={AlertTriangle}
                    variant="destructive"
                />
            </div>

            <div>
                <h2 className="text-lg font-semibold text-foreground mb-5">Recent Processing Jobs</h2>
                <JobsTable jobs={mockJobs.slice(0, 5)} compact />
            </div>
        </div>
    );
}
