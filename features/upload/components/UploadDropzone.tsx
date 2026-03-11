'use client';

import { useCallback, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import { toast } from "sonner";

interface UploadFile {
    id: string;
    file: File;
    progress: number;
    status: "pending" | "uploading" | "complete" | "error";
}

export const UploadDropzone = () => {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = useCallback((fileList: FileList) => {
        const newFiles: UploadFile[] = Array.from(fileList)
            .filter((f) => f.type === "application/pdf")
            .map((f) => ({
                id: crypto.randomUUID(),
                file: f,
                progress: 0,
                status: "pending" as const,
            }));

        if (newFiles.length === 0) {
            toast.error("Only PDF files are supported");
            return;
        }

        setFiles((prev) => [...prev, ...newFiles]);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    const removeFile = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const simulateUpload = () => {
        setFiles((prev) =>
            prev.map((f) => (f.status === "pending" ? { ...f, status: "uploading" as const } : f))
        );

        // Simulate progress
        const interval = setInterval(() => {
            setFiles((prev) => {
                const updated = prev.map((f) => {
                    if (f.status === "uploading" && f.progress < 100) {
                        const newProgress = Math.min(f.progress + Math.random() * 20, 100);
                        return {
                            ...f,
                            progress: newProgress,
                            status: newProgress >= 100 ? ("complete" as const) : f.status,
                        };
                    }
                    return f;
                });

                if (updated.every((f) => f.status !== "uploading")) {
                    clearInterval(interval);
                    toast.success("Upload successful! Processing will start shortly.");
                }

                return updated;
            });
        }, 300);
    };

    const pendingFiles = files.filter((f) => f.status !== "complete");

    return (
        <div className="space-y-6">
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
                    }`}
            >
                <input
                    type="file"
                    accept=".pdf"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
                <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-foreground">
                            Drop PDF files here or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Supports PDF documents up to 50MB each
                        </p>
                    </div>
                </div>
            </div>

            {files.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">
                        Files ({files.length})
                    </h3>
                    <div className="space-y-2">
                        {files.map((f) => (
                            <div
                                key={f.id}
                                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-soft animate-fade-in"
                            >
                                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                                    <FileText className="h-5 w-5 text-destructive" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{f.file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {(f.file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                    {f.status === "uploading" && (
                                        <Progress value={f.progress} className="h-1 mt-2" />
                                    )}
                                </div>
                                {f.status === "complete" ? (
                                    <span className="text-xs font-medium text-success">Done</span>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="shrink-0 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeFile(f.id)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {pendingFiles.length > 0 && (
                        <Button onClick={simulateUpload} className="w-full mt-4 rounded-xl h-11">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload {pendingFiles.length} file{pendingFiles.length > 1 ? "s" : ""}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};


