'use client';
import { useState } from "react";
import InstanceCard from "@/components/InstanceCard";
import JsonViewer from "@/components/JsonViewer";
import { mockDocumentResult, mockInstances } from "@/data/mockData";

const DocumentResultPage = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectedInstance = mockDocumentResult.instances[selectedIndex];

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
                    {mockInstances.map((instance, i) => (
                        <div
                            key={instance.id}
                            onClick={() => setSelectedIndex(i)}
                            className={`cursor-pointer rounded-xl transition-all ${selectedIndex === i ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                                }`}
                        >
                            <InstanceCard instance={instance} />
                        </div>
                    ))}
                </div>

                <div className="lg:sticky lg:top-24 lg:self-start">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Extracted JSON
                    </h2>
                    <JsonViewer data={selectedInstance?.extractedData || {}} />
                </div>
            </div>
        </div>
    );
};

export default DocumentResultPage;