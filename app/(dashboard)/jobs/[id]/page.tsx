import { BackButton } from '@/shared/components/BackButton';
import { RetryModalJobs } from '@/features/jobs';
import { mockJobs } from '@/data/mockData';

export default async function DetailJobsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const job = mockJobs.find((j) => j.id === id) || mockJobs[0];
    
    return (
        <div className="space-y-6 animate-fade-in">
            <BackButton href="/jobs" label="Back to Jobs" />
            <RetryModalJobs job={job} />
        </div>
    );
}