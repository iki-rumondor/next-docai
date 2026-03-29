import { Metadata } from 'next';
import { UploadDropzone } from '@/features/upload';

export const metadata: Metadata = {
    title: 'Upload Document | OCR Invoice',
    description: 'Upload PDF documents for AI-powered data extraction',
};

export default function UploadPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Upload Documents</h1>
                <p className="text-muted-foreground mt-1">
                    Upload PDF documents for AI-powered data extraction
                </p>
            </div>

            <UploadDropzone />
        </div>
    );
}
