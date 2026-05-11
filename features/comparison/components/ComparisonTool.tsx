"use client";
import { useState, useMemo } from "react";
import { 
  GitCompare, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowRightLeft,
  Loader2,
  Filter
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { toast } from "sonner";
import { compareJsonStrict, compareJsonStrict3, ComparisonResult } from "@/shared/lib/json-utils";
import { cn } from "@/shared/lib/utils";
import { useDocumentsList, useDocumentRaw, useDocumentTypes } from "@/features/documents/hooks/useDocuments";
import { useFileList } from "@/features/files/hooks/useFiles";
import { SourceFile } from "@/features/files/model/files.schema";

import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";

export const ComparisonTool = () => {
  const [jsonA, setJsonA] = useState("");
  const [jsonB, setJsonB] = useState("");
  const [jsonC, setJsonC] = useState("");
  const [selectedFileIdA, setSelectedFileIdA] = useState<string>("");
  const [selectedFileIdB, setSelectedFileIdB] = useState<string>("");
  const [selectedFileIdC, setSelectedFileIdC] = useState<string>("");
  const [selectedIdA, setSelectedIdA] = useState<string>("");
  const [selectedIdB, setSelectedIdB] = useState<string>("");
  const [selectedIdC, setSelectedIdC] = useState<string>("");
  const [selectedDocTypeCode, setSelectedDocTypeCode] = useState<string>("all");
  const [isLast24Hours, setIsLast24Hours] = useState(true);
  const [is3Way, setIs3Way] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  // Fetch all completed source files
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
    return {
      start: start.toISOString(),
      end: end.toISOString()
    };
  }, []);

  const { data: docTypesResponse } = useDocumentTypes();
  const allDocTypes = docTypesResponse?.data || [];

  const { data: filesResponse } = useFileList({ 
    status: 'completed', 
    limit: 100,
    start_date: isLast24Hours ? dateRange.start : undefined,
    end_date: isLast24Hours ? dateRange.end : undefined,
    target_doc_type: selectedDocTypeCode === "all" ? undefined : selectedDocTypeCode
  });
  const sourceFiles = useMemo(() => {
    const data = filesResponse?.data || [];
    const unique = new Map();
    data.forEach(file => unique.set(file.id, file));
    return Array.from(unique.values());
  }, [filesResponse]);

  // Reset selections when global doc type changes
  const [prevDocType, setPrevDocType] = useState("all");
  if (selectedDocTypeCode !== prevDocType) {
    setPrevDocType(selectedDocTypeCode);
    setSelectedFileIdA("");
    setSelectedFileIdB("");
    setSelectedFileIdC("");
    setSelectedIdA("");
    setSelectedIdB("");
    setSelectedIdC("");
    setJsonA("");
    setJsonB("");
    setJsonC("");
    setResult(null);
  }

  const { data: docsResponseA, isLoading: isLoadingDocsA } = useDocumentsList({
    source_file_id: selectedFileIdA || undefined,
    limit: 50
  });
  const { data: docsResponseB, isLoading: isLoadingDocsB } = useDocumentsList({
    source_file_id: selectedFileIdB || undefined,
    limit: 50
  });
  const { data: docsResponseC, isLoading: isLoadingDocsC } = useDocumentsList({
    source_file_id: selectedFileIdC || undefined,
    limit: 50
  });
  
  const { data: rawA, isLoading: isLoadingRawA } = useDocumentRaw(selectedIdA);
  const { data: rawB, isLoading: isLoadingRawB } = useDocumentRaw(selectedIdB);
  const { data: rawC, isLoading: isLoadingRawC } = useDocumentRaw(selectedIdC);

  const documentsA = useMemo(() => {
    const data = docsResponseA?.data || [];
    const unique = new Map();
    data.forEach(doc => unique.set(doc.id, doc));
    return Array.from(unique.values());
  }, [docsResponseA]);

  const documentsB = useMemo(() => {
    const data = docsResponseB?.data || [];
    const unique = new Map();
    data.forEach(doc => unique.set(doc.id, doc));
    return Array.from(unique.values());
  }, [docsResponseB]);

  const documentsC = useMemo(() => {
    const data = docsResponseC?.data || [];
    const unique = new Map();
    data.forEach(doc => unique.set(doc.id, doc));
    return Array.from(unique.values());
  }, [docsResponseC]);

  // Sync raw data A to textarea
  const [prevRawA, setPrevRawA] = useState<Record<string, unknown> | null>(null);
  if (rawA && rawA !== prevRawA) {
    setPrevRawA(rawA as Record<string, unknown>);
    setJsonA(JSON.stringify(rawA, null, 2));
  }

  // Sync raw data B to textarea
  const [prevRawB, setPrevRawB] = useState<Record<string, unknown> | null>(null);
  if (rawB && rawB !== prevRawB) {
    setPrevRawB(rawB as Record<string, unknown>);
    setJsonB(JSON.stringify(rawB, null, 2));
  }

  // Sync raw data C to textarea
  const [prevRawC, setPrevRawC] = useState<Record<string, unknown> | null>(null);
  if (rawC && rawC !== prevRawC) {
    setPrevRawC(rawC as Record<string, unknown>);
    setJsonC(JSON.stringify(rawC, null, 2));
  }

  const handleCompare = () => {
    if (!jsonA.trim() || !jsonB.trim() || (is3Way && !jsonC.trim())) {
      toast.error(is3Way ? "Please provide all three JSON inputs" : "Please provide both JSON inputs");
      return;
    }

    try {
      const comparison = is3Way 
        ? compareJsonStrict3(jsonA, jsonB, jsonC)
        : compareJsonStrict(jsonA, jsonB);
        
      setResult(comparison);
      
      if (comparison.isIdentical) {
        toast.success(is3Way ? "All three documents are 100% identical!" : "Documents are 100% identical!");
      } else {
        toast.warning(`Documents differ. Accuracy: ${comparison.accuracy}%`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to compare JSON";
      toast.error(errorMessage);
    }
  };

  const handleBeautify = (side: 'A' | 'B' | 'C') => {
    try {
      const target = side === 'A' ? jsonA : side === 'B' ? jsonB : jsonC;
      if (!target.trim()) return;
      const formatted = JSON.stringify(JSON.parse(target), null, 2);
      if (side === 'A') setJsonA(formatted);
      else if (side === 'B') setJsonB(formatted);
      else setJsonC(formatted);
      toast.success(`JSON ${side} formatted`);
    } catch {
      toast.error(`Invalid JSON in Input ${side}`);
    }
  };

  const handleClear = () => {
    setJsonA("");
    setJsonB("");
    setJsonC("");
    setSelectedFileIdA("");
    setSelectedFileIdB("");
    setSelectedFileIdC("");
    setSelectedIdA("");
    setSelectedIdB("");
    setSelectedIdC("");
    setResult(null);
    toast.info("Cleared all inputs");
  };

  const diffCount = useMemo(() => {
    return result?.diffDetails.filter(d => !d.isMatch).length || 0;
  }, [result]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      {/* Input Section */}
      <div className="lg:col-span-8 space-y-6">
        {/* Global Controls & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card/30 border border-border/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Filter className="h-3 w-3" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Target Type</span>
            </div>
            <Select value={selectedDocTypeCode} onValueChange={setSelectedDocTypeCode}>
              <SelectTrigger className="h-8 w-[180px] bg-background/50 border-border/40 text-xs">
                <SelectValue placeholder="All Target Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Document Types</SelectItem>
                {allDocTypes.map((type) => (
                  <SelectItem key={type.id || ""} value={type.code || ""}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-background/40 border border-border/20">
              <Switch 
                id="last-24h" 
                checked={isLast24Hours} 
                onCheckedChange={setIsLast24Hours}
                className="scale-75"
              />
              <Label htmlFor="last-24h" className="text-[10px] font-medium cursor-pointer uppercase tracking-tight">Last 24 Hours</Label>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-primary/5 border border-primary/20">
              <Switch 
                id="is-3way" 
                checked={is3Way} 
                onCheckedChange={setIs3Way}
                className="scale-75"
              />
              <Label htmlFor="is-3way" className="text-[10px] font-bold cursor-pointer uppercase tracking-tight text-primary">3-Way Mode</Label>
            </div>

            {(isLoadingDocsA || isLoadingDocsB || isLoadingDocsC) && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
          </div>

          <div className="flex items-center gap-2">
            <Button 
              size="sm"
              onClick={handleCompare}
              disabled={!jsonA || !jsonB || (is3Way && !jsonC)}
              className="rounded-lg bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-95"
            >
              <GitCompare className="mr-2 h-3.5 w-3.5" />
              Compare
            </Button>
            <Button 
              size="sm"
              variant="outline" 
              onClick={handleClear}
              className="rounded-lg border-border/40 hover:bg-muted/50 h-8"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Clear
            </Button>
          </div>
        </div>

        <div className={cn(
          "grid gap-4",
          is3Way ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
        )}>
          {/* Input A */}
          <Card className="border-border/40 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="py-3 px-4 flex flex-col gap-3 bg-muted/30 border-b border-border/40">
              <div className="flex flex-col gap-2">
                {/* File Selection */}
                <div className="flex items-center gap-2">
                  <Select value={selectedFileIdA} onValueChange={(val) => {
                    setSelectedFileIdA(val);
                    setSelectedIdA(""); // Reset doc selection
                  }}>
                    <SelectTrigger className="h-8 flex-1 text-[11px] bg-background/50 border-primary/20">
                      <SelectValue placeholder="1. Select Source File" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceFiles
                        .filter((file: SourceFile) => file.id !== selectedFileIdB && file.id !== selectedFileIdC)
                        .map((file: SourceFile) => (
                        <SelectItem key={file.id} value={file.id}>
                          <span className="truncate">{file.file_name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Document Selection */}
                <div className="flex items-center gap-2">
                  <Select 
                    value={selectedIdA} 
                    onValueChange={setSelectedIdA}
                    disabled={!selectedFileIdA || documentsA.length === 0}
                  >
                    <SelectTrigger className="h-8 flex-1 text-[11px] bg-background/50 border-primary/20">
                      <SelectValue placeholder={isLoadingDocsA ? "Loading docs..." : "2. Select Document"} />
                    </SelectTrigger>
                    <SelectContent>
                      {documentsA.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id}>
                          <div className="flex flex-col">
                            <span className="font-semibold">Page {doc.start_page}</span>
                            <span className="text-[10px] text-muted-foreground">{doc.document_type?.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isLoadingRawA && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border/20">
                <Badge variant="outline" className="h-5 px-1.5 text-[9px] bg-primary/5 text-primary border-primary/10">INPUT A</Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-muted-foreground"
                  onClick={() => handleBeautify('A')}
                  title="Format JSON"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <textarea
                value={jsonA}
                onChange={(e) => setJsonA(e.target.value)}
                placeholder="Paste first JSON here or select a document..."
                className="w-full h-[400px] p-4 bg-transparent font-mono text-[13px] leading-relaxed resize-none outline-none focus:ring-0 placeholder:text-muted-foreground/50 text-foreground"
                spellCheck={false}
              />
            </CardContent>
          </Card>

          {/* Input B */}
          <Card className="border-border/40 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="py-3 px-4 flex flex-col gap-3 bg-muted/30 border-b border-border/40">
              <div className="flex flex-col gap-2">
                {/* File Selection */}
                <div className="flex items-center gap-2">
                  <Select value={selectedFileIdB} onValueChange={(val) => {
                    setSelectedFileIdB(val);
                    setSelectedIdB(""); // Reset doc selection
                  }}>
                    <SelectTrigger className="h-8 flex-1 text-[11px] bg-background/50 border-indigo-500/20">
                      <SelectValue placeholder="1. Select Source File" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceFiles
                        .filter((file: SourceFile) => file.id !== selectedFileIdA && file.id !== selectedFileIdC)
                        .map((file: SourceFile) => (
                        <SelectItem key={file.id} value={file.id}>
                          <span className="truncate">{file.file_name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Document Selection */}
                <div className="flex items-center gap-2">
                  <Select 
                    value={selectedIdB} 
                    onValueChange={setSelectedIdB}
                    disabled={!selectedFileIdB || documentsB.length === 0}
                  >
                    <SelectTrigger className="h-8 flex-1 text-[11px] bg-background/50 border-indigo-500/20">
                      <SelectValue placeholder={isLoadingDocsB ? "Loading docs..." : "2. Select Document"} />
                    </SelectTrigger>
                    <SelectContent>
                      {documentsB.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id}>
                            <div className="flex flex-col">
                              <span className="font-semibold">Page {doc.start_page}</span>
                              <span className="text-[10px] text-muted-foreground">{doc.document_type?.name}</span>
                            </div>
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isLoadingRawB && <Loader2 className="h-3 w-3 animate-spin text-indigo-500" />}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border/20">
                <Badge variant="outline" className="h-5 px-1.5 text-[9px] bg-indigo-500/5 text-indigo-600 border-indigo-500/10">INPUT B</Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-muted-foreground"
                  onClick={() => handleBeautify('B')}
                  title="Format JSON"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <textarea
                value={jsonB}
                onChange={(e) => setJsonB(e.target.value)}
                placeholder="Paste second JSON here..."
                className="w-full h-[400px] p-4 bg-transparent font-mono text-[13px] leading-relaxed resize-none outline-none focus:ring-0 placeholder:text-muted-foreground/50 text-foreground"
                spellCheck={false}
              />
            </CardContent>
          </Card>

          {/* Input C */}
          {is3Way && (
            <Card className="border-border/40 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
              <CardHeader className="py-3 px-4 flex flex-col gap-3 bg-muted/30 border-b border-border/40">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Select value={selectedFileIdC} onValueChange={(val) => {
                      setSelectedFileIdC(val);
                      setSelectedIdC("");
                    }}>
                      <SelectTrigger className="h-8 flex-1 text-[11px] bg-background/50 border-orange-500/20">
                        <SelectValue placeholder="1. Select Source File" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceFiles
                          .filter((file: SourceFile) => file.id !== selectedFileIdA && file.id !== selectedFileIdB)
                          .map((file: SourceFile) => (
                          <SelectItem key={file.id} value={file.id}>
                            <span className="truncate">{file.file_name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select 
                      value={selectedIdC} 
                      onValueChange={setSelectedIdC}
                      disabled={!selectedFileIdC || documentsC.length === 0}
                    >
                      <SelectTrigger className="h-8 flex-1 text-[11px] bg-background/50 border-orange-500/20">
                        <SelectValue placeholder={isLoadingDocsC ? "Loading docs..." : "2. Select Document"} />
                      </SelectTrigger>
                      <SelectContent>
                        {documentsC.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id}>
                            <div className="flex flex-col">
                              <span className="font-semibold">Page {doc.start_page}</span>
                              <span className="text-[10px] text-muted-foreground">{doc.document_type?.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isLoadingRawC && <Loader2 className="h-3 w-3 animate-spin text-orange-500" />}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/20">
                  <Badge variant="outline" className="h-5 px-1.5 text-[9px] bg-orange-500/5 text-orange-600 border-orange-500/10">INPUT C</Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-muted-foreground"
                    onClick={() => handleBeautify('C')}
                    title="Format JSON"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <textarea
                  value={jsonC}
                  onChange={(e) => setJsonC(e.target.value)}
                  placeholder="Paste third JSON here..."
                  className="w-full h-[400px] p-4 bg-transparent font-mono text-[13px] leading-relaxed resize-none outline-none focus:ring-0 placeholder:text-muted-foreground/50 text-foreground"
                  spellCheck={false}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button 
            variant="outline" 
            className="rounded-xl px-6"
            onClick={handleClear}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button 
            className="rounded-xl px-8 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
            onClick={handleCompare}
          >
            <GitCompare className="h-4 w-4 mr-2" />
            Run Comparison
          </Button>
        </div>

        {/* Diff Result Table (Only if differences exist) */}
        {result && !result.isIdentical && (
          <Card className="border-border/40 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
                <ArrowRightLeft className="h-4 w-4" />
                Mismatch Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-border/40 overflow-hidden">
                <div className="max-h-[300px] overflow-y-auto">
                  <table className="w-full text-[13px]">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr>
                        <th className="py-2 px-4 text-left font-semibold text-muted-foreground border-b border-border/40 w-16">Line</th>
                        <th className="py-2 px-4 text-left font-semibold text-muted-foreground border-b border-border/40">JSON A</th>
                        <th className="py-2 px-4 text-left font-semibold text-muted-foreground border-b border-border/40">JSON B</th>
                        {is3Way && <th className="py-2 px-4 text-left font-semibold text-muted-foreground border-b border-border/40">JSON C</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 font-mono">
                      {result.diffDetails.filter(d => !d.isMatch).map((diff, idx) => (
                        <tr key={idx} className="hover:bg-accent/20 transition-colors">
                          <td className="py-2 px-4 text-muted-foreground bg-muted/10">{diff.line}</td>
                          <td className="py-2 px-4 text-destructive bg-destructive/5">{diff.valueA}</td>
                          <td className="py-2 px-4 text-indigo-600 bg-indigo-500/5">{diff.valueB}</td>
                          {is3Way && <td className="py-2 px-4 text-orange-600 bg-orange-500/5">{diff.valueC}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Section */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-xl sticky top-28">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Comparison Result
            </CardTitle>
            <CardDescription>Metrics based on strict structural parity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Accuracy Metric */}
            <div className="text-center space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <svg className="h-32 w-32 transform -rotate-90">
                  <circle
                    className="text-muted-foreground/10"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className={cn(
                      "transition-all duration-1000 ease-out",
                      (result?.accuracy || 0) === 100 ? "text-primary" : "text-amber-500"
                    )}
                    strokeWidth="8"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * (result?.accuracy || 0)) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">
                    {result ? Math.round(result.accuracy) : 0}%
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-tighter">Accuracy</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/40">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    result?.isIdentical ? "bg-primary animate-pulse" : "bg-muted"
                  )} />
                  <span className="text-sm font-medium">Identical Status</span>
                </div>
                <Badge variant={result?.isIdentical ? "default" : "outline"} className={cn(
                  "rounded-lg",
                  result?.isIdentical ? "bg-primary" : "text-muted-foreground"
                )}>
                  {result?.isIdentical ? "Identical" : "Differing"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/40">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Mismatched Lines</span>
                </div>
                <span className="text-sm font-bold">{diffCount}</span>
              </div>
            </div>

            {!result && (
              <div className="p-4 rounded-xl border border-dashed border-border/60 text-center">
                <p className="text-xs text-muted-foreground italic">
                  Paste JSON strings and click Run Comparison to see metrics
                </p>
              </div>
            )}

            {result?.isIdentical && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center animate-bounce-subtle">
                <p className="text-xs text-primary font-semibold flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  No structural differences found
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
