"use client";

import dynamic from "next/dynamic";

const ComparisonTool = dynamic(
  () => import("../../../features/comparison/components/ComparisonTool").then((mod) => mod.ComparisonTool),
  { ssr: false }
);

export default function ComparisonPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">JSON Comparison</h1>
        <p className="text-muted-foreground mt-2">
          Compare two raw JSON payloads to verify structural identity and calculate accuracy.
        </p>
      </div>

      <ComparisonTool />
    </div>
  );
}
