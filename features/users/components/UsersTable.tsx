"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
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
import { MoreHorizontal, Pencil, Trash, Loader2 } from "lucide-react";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useMemo } from "react";
import { User } from "../model/user.schema";

const roleBadgeVariant = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return "default";
    case "operator":
      return "secondary";
    default:
      return "outline";
  }
};

const columnHelper = createColumnHelper<User>();

export const UsersTable = () => {
  const { useUsersList, delete: deleteUser, isDeleting } = useUsers();
  const { data: queryData, isLoading, error } = useUsersList();

  const data = useMemo(() => {
    return queryData?.data || [];
  }, [queryData]);

  const columns = useMemo(() => {
    return [
      columnHelper.accessor("name", {
        header: "User",
        cell: (info) => {
          const user = info.row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {user.name
                    ?.split(" ")
                    .map((n: string) => n[0])
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
          );
        },
      }),
      columnHelper.accessor("role", {
        header: "Role",
        cell: (info) => (
          <Badge variant={roleBadgeVariant(info.getValue())}>
            <span className="capitalize">{info.getValue()}</span>
          </Badge>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue() || 'active';
          return (
            <Badge
              variant={status === "active" ? "default" : "outline"}
              className={
                status === "active"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/10"
                  : ""
              }
            >
              {status === "active" ? "Aktif" : "Nonaktif"}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("lastLogin", {
        header: "Last Login",
        cell: (info) => (
          <span className="text-[13px] text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: (info) => (
          <div className="text-right">
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
                <DropdownMenuItem>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  disabled={isDeleting}
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this user?')) {
                      deleteUser(info.row.original.id);
                    }
                  }}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      }),
    ];
  }, [deleteUser, isDeleting]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading)
    return (
      <div className="p-12 flex flex-col items-center justify-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm">Loading users...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-12 text-center text-destructive">
        Error loading data: {(error as Error).message}
      </div>
    );

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="bg-muted/40 hover:bg-muted/40 border-b border-border/50"
          >
            {headerGroup.headers.map((header, index) => (
              <TableHead
                key={header.id}
                className={`font-semibold text-[11px] uppercase tracking-widest text-muted-foreground py-4 ${
                  index === 0
                    ? "px-5"
                    : index === headerGroup.headers.length - 1
                      ? "px-5 text-right"
                      : ""
                }`}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row, idx) => (
          <TableRow
            key={row.id}
            className={`transition-colors duration-150 hover:bg-accent/40 ${
              idx !== table.getRowModel().rows.length - 1
                ? "border-b border-border/30"
                : ""
            }`}
          >
            {row.getVisibleCells().map((cell, index) => (
              <TableCell
                key={cell.id}
                className={`py-4 ${
                  index === 0
                    ? "px-5"
                    : index === row.getVisibleCells().length - 1
                      ? "px-5 text-right"
                      : ""
                }`}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
