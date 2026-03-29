import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'User Management | OCR Invoice',
    description: 'Manage user roles, system access, and accounts',
};

export default function UsersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
