import { BackButton } from '@/shared/components/BackButton';
import { RetryModalFiles } from '@/features/files';
import { mockJobs } from '@/data/mockData';

export default async function DetailFilesPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const job = mockJobs.find((j) => j.id === id) || mockJobs[0];
    
    return (
        <div className="space-y-6 animate-fade-in">
            <BackButton href="/files" label="Back to Files" />
            <RetryModalFiles job={job} />
        </div>
    );
}