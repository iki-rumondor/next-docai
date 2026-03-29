import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Document Results | OCR Invoice',
    description: 'Review extracted structured data from processed documents',
};

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
