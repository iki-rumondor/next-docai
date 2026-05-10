import "./globals.css";
import type { Metadata } from "next";
import { Inter, Geist } from 'next/font/google';
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { Toaster } from "sonner";
import QueryProvider from "@/shared/providers/QueryProvider";
import { cn } from "@/shared/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });


// Konfigurasi font Inter
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});


export const metadata: Metadata = {
  title: "OCR Invoice",
  description: "Aplikasi Ekstraksi Data Invoice Otomatis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
