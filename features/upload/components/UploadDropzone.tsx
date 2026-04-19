'use client';

import { useCallback, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";

const DOC_TYPES = [
    { value: "380", label: "380: Invoice" },
    { value: "217", label: "217: Packing List" },
    { value: "001", label: "001: CIPL" },
    { value: "705", label: "705: Bill of Lading (B/L)" },
    { value: "740", label: "740: Air Way Bill (AWB)" },
    { value: "704", label: "704: Master (B/L)" },
    { value: "741", label: "741: Master (AWB)" },
    { value: "860", label: "860: ECOO" },
    { value: "861", label: "861: COO" },
    { value: "958", label: "958: Laporan Surveyor" },
    { value: "457", label: "457: SKB PPh" },
    { value: "800", label: "800: POSTEL" },
    { value: "813", label: "813: CK" },
    { value: "846", label: "846: SKEM" },
    { value: "854", label: "854: BPOM" },
    { value: "871", label: "871: AKL" },
    { value: "888", label: "888: Pengecualian Perijinan" },
    { value: "957", label: "957: SNI/SPB" },
    { value: "959", label: "959: PI" },
    { value: "000", label: "000: Cukai" },
    { value: "999", label: "999: Lainnya" }
];

interface UploadFile {
    id: string;
    file: File;
    progress: number;
    status: "pending" | "uploading" | "complete" | "error";
}

import { useUpload } from "../hooks/useUpload";

export const UploadDropzone = () => {
    const { uploadAsync, isUploading } = useUpload();
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [docType, setDocType] = useState<string>("");

    const handleFiles = useCallback((fileList: FileList) => {
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "application/vnd.ms-excel", // .xls
            "image/jpeg",
            "image/png",
            "image/jpg"
        ];
        
        const newFiles: UploadFile[] = Array.from(fileList)
            .filter((f) => allowedTypes.includes(f.type))
            .map((f) => ({
                id: crypto.randomUUID(),
                file: f,
                progress: 0,
                status: "pending" as const,
            }));

        if (newFiles.length === 0) {
            toast.error("Only PDF, Excel, and Image files are supported");
            return;
        }

        setFiles((prev) => [...prev, ...newFiles]);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) {
                handleFiles(e.dataTransfer.files);
            }
        },
        [handleFiles]
    );

    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const handleUpload = async () => {
        const pendingFiles = files.filter((f) => f.status === "pending");
        
        for (const fileObj of pendingFiles) {
            // Update status to uploading and initial progress
            setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: "uploading" as const, progress: 0 } : f));
            
            try {
                await uploadAsync({ 
                    file: fileObj.file,
                    docType: docType || undefined,
                    onProgress: (percent) => {
                        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, progress: percent } : f));
                    }
                });
                
                setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: "complete" as const, progress: 100 } : f));
            } catch {
                setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: "error" as const } : f));
            }
        }
    };

    const uploadProgressFiles = files.filter((f) => f.status !== "complete" && f.status !== "pending");
    const isAnyUploading = uploadProgressFiles.length > 0 || isUploading;

    return (
        <div className="space-y-6">
            <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm">
                <div className="mb-4 space-y-2">
                    <Label htmlFor="doc-type" className="text-sm font-semibold text-foreground">
                        Document Type (Required)
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                        Select the exact type of document you are uploading. <span className="font-medium text-primary">Choosing a specific document type significantly improves OCR extraction accuracy.</span>
                    </p>
                </div>
                <Select value={docType} onValueChange={setDocType} disabled={isAnyUploading}>
                    <SelectTrigger id="doc-type" className={`w-full md:w-[320px] rounded-xl shadow-sm h-11 ${!docType ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'bg-background'}`}>
                        <SelectValue placeholder="Select document type first..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] rounded-xl">
                        {DOC_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {!docType ? (
                <div className="rounded-2xl border-2 border-dashed border-border/50 p-12 text-center bg-muted/20 opacity-60 transition-all duration-300">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                            <FileText className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-muted-foreground">
                                Please choose a document type above
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                The upload area will become available once you make a selection.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200 ${isDragging
                        ? "border-primary bg-primary/5 scale-[1.01]"
                        : "border-border hover:border-primary/40 hover:bg-accent/30"
                    } ${isAnyUploading ? "opacity-50 pointer-events-none" : ""}`}
            >
                <input
                    type="file"
                    accept=".pdf,.xlsx,.xls,.png,.jpg,.jpeg"
                    multiple
                    disabled={isAnyUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
                <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-foreground">
                            Drop documents here or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Supports PDF, Excel, and Image files up to 50MB each
                        </p>
                    </div>
                </div>
            </div>

            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">
                            Queue ({files.length})
                        </h3>
                        {files.some(f => f.status === 'complete') && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setFiles(prev => prev.filter(f => f.status !== 'complete'))}
                                className="text-xs text-muted-foreground"
                            >
                                Clear Completed
                            </Button>
                        )}
                    </div>
                    <div className="space-y-2">
                        {files.map((f) => (
                            <div
                                key={f.id}
                                className={`flex items-center gap-3 rounded-xl border p-4 shadow-soft animate-fade-in transition-colors ${
                                    f.status === 'error' ? 'border-destructive/30 bg-destructive/5' : 
                                    f.status === 'complete' ? 'border-success/30 bg-success/5' : 'border-border/60 bg-card'
                                }`}
                            >
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                                    f.status === 'error' ? 'bg-destructive/10' : 
                                    f.status === 'complete' ? 'bg-success/10' : 'bg-primary/10'
                                }`}>
                                    <FileText className={`h-5 w-5 ${
                                        f.status === 'error' ? 'text-destructive' : 
                                        f.status === 'complete' ? 'text-success' : 'text-primary'
                                    }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-medium truncate">{f.file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {(f.file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    {(f.status === "uploading" || f.status === "pending") && (
                                        <Progress value={f.progress} className="h-1" />
                                    )}
                                    {f.status === "error" && (
                                        <p className="text-[10px] text-destructive font-medium">Upload failed</p>
                                    )}
                                </div>
                                {f.status === "complete" ? (
                                    <div className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-success" />
                                    </div>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={isAnyUploading}
                                        className="shrink-0 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeFile(f.id)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {files.some(f => f.status === 'pending') && (
                        <div className="pt-2">
                            {docType && (
                                <p className="text-xs text-muted-foreground mb-3 text-center">
                                    Files will be tagged as: <span className="font-semibold text-foreground">{DOC_TYPES.find(t => t.value === docType)?.label}</span>
                                </p>
                            )}
                            <Button 
                                onClick={handleUpload} 
                                disabled={isAnyUploading}
                            className="w-full mt-2 rounded-xl h-12 shadow-primary/20 shadow-lg"
                        >
                            {isAnyUploading ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload {files.filter(f => f.status === 'pending').length} Files
                                </>
                            )}
                            </Button>
                        </div>
                    )}
                </div>
            )}
                </>
            )}
        </div>
    );
};


