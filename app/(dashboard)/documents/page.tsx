"use client";

import { useState } from "react";
import { DocumentCard, JsonViewer, useDocumentsList, useDocumentRaw } from "@/features/documents";
import { Loader2 } from "lucide-react";

/**
 * Page to review extracted structured data from processed documents.
 * Replaces the previous mock-based implementation with real API integration.
 */
const DocumentResultPage = () => {
    const { data: documentsData, isLoading } = useDocumentsList();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const { data: rawData, isLoading: isRawLoading } = useDocumentRaw(selectedId || "");

    const documents = documentsData?.data || [];

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Document Results</h1>
                <p className="text-muted-foreground mt-1">
                    Review extracted structured data from processed documents
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Document Instances
                    </h2>
                    {isLoading ? (
                        <div className="py-20 flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : documents.length > 0 ? (
                        documents.map((doc) => (
                            <div
                                key={doc.id}
                                onClick={() => setSelectedId(doc.id)}
                                className={`cursor-pointer transition-all ${selectedId === doc.id 
                                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-2xl" 
                                    : ""
                                }`}
                            >
                                <DocumentCard document={doc} />
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center rounded-2xl border border-dashed text-muted-foreground bg-card">
                            No processed documents found.
                        </div>
                    )}
                </div>

                <div className="lg:sticky lg:top-24 lg:self-start space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Extracted JSON Payload
                    </h2>
                    {selectedId ? (
                        isRawLoading ? (
                            <div className="p-20 flex flex-col items-center justify-center bg-card rounded-2xl border border-border/50 shadow-sm">
                                <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                                <p className="text-xs text-muted-foreground">Loading raw payload...</p>
                            </div>
                        ) : (
                            <JsonViewer data={rawData} />
                        )
                    ) : (
                        <div className="p-20 text-center bg-card rounded-2xl border border-dashed border-border/50 text-muted-foreground text-sm shadow-sm">
                            Select a document instance from the list to view its raw JSON payload.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentResultPage;
