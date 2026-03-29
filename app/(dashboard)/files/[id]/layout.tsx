import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'File Details | OCR Invoice',
    description: 'View detailed information and extraction results for a specific file',
};

export default function FileDetailLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
