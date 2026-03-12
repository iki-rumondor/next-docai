import { Button } from '@/shared/components/ui/button'
import { UserPlus } from 'lucide-react'

export const AddUser = () => {
    return (
        <Button className="rounded-xl gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
        </Button>
    )
}