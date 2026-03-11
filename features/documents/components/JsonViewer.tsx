'use client';
import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";

interface JsonViewerProps {
    data: unknown;
    title?: string;
}

const JsonNode = ({ data, depth = 0 }: { data: unknown; depth?: number }) => {
    const [collapsed, setCollapsed] = useState(depth > 1);

    if (data === null) return <span className="text-muted-foreground">null</span>;
    if (typeof data === "boolean") return <span className="text-primary">{String(data)}</span>;
    if (typeof data === "number") return <span className="text-success">{data}</span>;
    if (typeof data === "string") return <span className="text-warning">&quot;{data}&quot;</span>;

    if (Array.isArray(data)) {
        if (data.length === 0) return <span className="text-muted-foreground">[]</span>;
        return (
            <div>
                <button onClick={() => setCollapsed(!collapsed)} className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                    {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    <span className="text-muted-foreground text-xs">[{data.length} items]</span>
                </button>
                {!collapsed && (
                    <div className="ml-4 border-l border-border/60 pl-3 mt-1 space-y-1">
                        {data.map((item, i) => (
                            <div key={i}>
                                <JsonNode data={item} depth={depth + 1} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (typeof data === "object") {
        const entries = Object.entries(data as Record<string, unknown>);
        if (entries.length === 0) return <span className="text-muted-foreground">{"{}"}</span>;
        return (
            <div>
                <button onClick={() => setCollapsed(!collapsed)} className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                    {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    <span className="text-muted-foreground text-xs">{`{${entries.length} keys}`}</span>
                </button>
                {!collapsed && (
                    <div className="ml-4 border-l border-border/60 pl-3 mt-1 space-y-1">
                        {entries.map(([key, value]) => (
                            <div key={key}>
                                <span className="text-foreground font-medium text-sm">{key}</span>
                                <span className="text-muted-foreground">: </span>
                                <JsonNode data={value} depth={depth + 1} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return <span>{String(data)}</span>;
};

export const JsonViewer = ({ data, title = "JSON Output" }: JsonViewerProps) => {
    const jsonString = JSON.stringify(data, null, 2);

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonString);
        toast.success("JSON copied to clipboard");
    };

    const handleDownload = () => {
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "document-result.json";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("JSON downloaded");
    };

    return (
        <div className="rounded-2xl border border-border/50 bg-card shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="text-muted-foreground hover:text-foreground rounded-xl">
                        <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDownload} className="text-muted-foreground hover:text-foreground rounded-xl">
                        <Download className="h-3.5 w-3.5 mr-1.5" /> Download
                    </Button>
                </div>
            </div>
            <div className="p-6 font-mono text-[13px] overflow-auto max-h-[600px]">
                <JsonNode data={data} />
            </div>
        </div>
    );
};


