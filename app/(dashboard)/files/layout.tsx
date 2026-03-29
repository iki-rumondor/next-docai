import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Files Manager | OCR Invoice',
    description: 'Monitor and manage all document files',
};

export default function FilesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
