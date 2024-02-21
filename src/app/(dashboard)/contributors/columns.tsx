"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ContributorDto } from "@/app/api/contributors/fetchUserContributors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const contributorsColumns: ColumnDef<ContributorDto>[] = [
  {
    id: "avatar",
    cell: ({ row }) => {
      const contributor = row.original;
      return (
        <div>
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://github.com/${contributor.userName}.png?size=100`}
              alt={contributor.userName}
            />
            <AvatarFallback>{contributor.userName[0]}</AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: "userName",
    header: () => <div className="text-left"> Name </div>,
  },
  {
    accessorKey: "contributionScore",
    header: () => <div className="text-left"> ContributionScore </div>,
  },
  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View contributor details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
