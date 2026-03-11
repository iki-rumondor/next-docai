'use client';

import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
    href?: string;
    label?: string;
}

export function BackButton({ href, label }: BackButtonProps) {
    const router = useRouter();
    return (
        <Button
            variant="ghost"
            onClick={() => router.push(href || '/')}
            size="lg"
            className="text-muted-foreground hover:text-foreground -ml-2"
        >
            <ArrowLeft className="h-4 w-4 mr-1" /> {label || "Back"}
        </Button>
    )
}
