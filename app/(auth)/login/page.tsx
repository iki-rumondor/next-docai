import { Metadata } from "next";
import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
    title: 'Login | OCR Invoice',
    description: 'Sign in to access your OCR Invoice dashboard',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <LoginForm />
        </div>
    );
}
