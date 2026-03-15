'use client';

import { Button } from '@/shared/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/shared/components/ui/dialog';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { User } from '../model/user.schema';

interface DeleteUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteUserDialog = ({ user, open, onOpenChange }: DeleteUserDialogProps) => {
    const { delete: deleteUser, isDeleting } = useUsers();

    const handleDelete = () => {
        if (!user) return;
        deleteUser(user.id, {
            onSuccess: () => {
                onOpenChange(false);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] rounded-2xl">
                <DialogHeader className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <DialogTitle className="text-xl">Delete User</DialogTitle>
                    <DialogDescription className="mt-2">
                        Are you sure you want to delete <span className="font-semibold text-foreground">{user?.name}</span>? 
                        This action cannot be undone and the user will lose all access.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="grid grid-cols-2 gap-3 mt-6">
                    <Button 
                        type="button" 
                        variant="outline" 
                        className="rounded-xl h-11"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="button" 
                        variant="destructive" 
                        className="rounded-xl h-11" 
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Deleting...
                            </>
                        ) : (
                            'Delete User'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
