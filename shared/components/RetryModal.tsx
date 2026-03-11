import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface RetryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
}

export const RetryModal = ({ open, onOpenChange, title, description }: RetryModalProps) => {
    const handleRetry = () => {
        onOpenChange(false);
        toast.success("Retry triggered. Processing will restart shortly.");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <RotateCcw className="h-5 w-5 text-primary" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
                        Cancel
                    </Button>
                    <Button onClick={handleRetry} className="rounded-xl">
                        Confirm Retry
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
