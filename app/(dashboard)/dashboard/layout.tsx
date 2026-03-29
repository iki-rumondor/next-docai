import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | OCR Invoice',
    description: 'Operational overview of document processing',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
