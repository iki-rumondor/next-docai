import TopNavigation from "@/components/TopNavigation";
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
    )
}