import TopNavigation from "@/shared/components/TopNavigation";
import "./style.css"


export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-background">
            <TopNavigation />
            <main className="mx-auto max-w-7xl px-6 py-8">
                {children}
            </main>
        </div>
    )
}
