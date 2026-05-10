import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Comparison | OCR DocAI",
  description: "Compare two raw JSON documents for identity and accuracy",
};

export default function ComparisonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
