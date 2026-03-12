import { AddUser, UsersTable } from "@/features/users";

const UserManagementPage = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all users and permissions
          </p>
        </div>
        <AddUser />
      </div>

      <div className="rounded-2xl border border-border/50 bg-card shadow-card overflow-hidden">
        <UsersTable />
      </div>
    </div>
  );
};

export default UserManagementPage;
