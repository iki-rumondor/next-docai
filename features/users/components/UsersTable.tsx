import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const mockUsers = [
  {
    id: "1",
    name: "Ahmad Fauzi",
    email: "ahmad@example.com",
    role: "Admin",
    status: "active",
    lastLogin: "2026-03-12",
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    email: "siti@example.com",
    role: "Editor",
    status: "active",
    lastLogin: "2026-03-11",
  },
  {
    id: "3",
    name: "Budi Santoso",
    email: "budi@example.com",
    role: "Viewer",
    status: "active",
    lastLogin: "2026-03-10",
  },
  {
    id: "4",
    name: "Dewi Lestari",
    email: "dewi@example.com",
    role: "Editor",
    status: "inactive",
    lastLogin: "2026-02-28",
  },
  {
    id: "5",
    name: "Reza Pratama",
    email: "reza@example.com",
    role: "Viewer",
    status: "active",
    lastLogin: "2026-03-09",
  },
];

const roleBadgeVariant = (role: string) => {
  switch (role) {
    case "Admin":
      return "default";
    case "Editor":
      return "secondary";
    default:
      return "outline";
  }
};

export const UsersTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/50">
          <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4 px-5">
            User
          </TableHead>
          <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4">
            Role
          </TableHead>
          <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4">
            Status
          </TableHead>
          <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4">
            Last Login
          </TableHead>
          <TableHead className="font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4 px-5 text-right">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockUsers.map((user, idx) => (
          <TableRow
            key={user.id}
            className={`transition-colors duration-150 hover:bg-accent/40 ${
              idx !== mockUsers.length - 1 ? "border-b border-border/30" : ""
            }`}
          >
            <TableCell className="py-4 px-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[13px] font-medium">{user.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell className="py-4">
              <Badge variant={roleBadgeVariant(user.role)}>{user.role}</Badge>
            </TableCell>
            <TableCell className="py-4">
              <Badge
                variant={user.status === "active" ? "default" : "outline"}
                className={
                  user.status === "active"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10"
                    : ""
                }
              >
                {user.status === "active" ? "Aktif" : "Nonaktif"}
              </Badge>
            </TableCell>
            <TableCell className="text-[13px] text-muted-foreground py-4">
              {user.lastLogin}
            </TableCell>
            <TableCell className="text-right py-4 px-5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
