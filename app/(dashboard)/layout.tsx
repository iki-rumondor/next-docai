import "./style.css"


export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
                <div className="min-h-screen bg-background">
                    <main className="mx-auto max-w-7xl px-6 py-8">
                        <TopNavigation />
                        {children}
                    </main>
                </div>
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
            </TooltipProvider>
        </QueryClientProvider>
    )
}