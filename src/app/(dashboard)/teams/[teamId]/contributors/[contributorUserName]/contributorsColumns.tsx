"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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
import { useRouter } from "next/navigation";

interface TeamContributorsColumnsProps {
  teamId: string;
}

export default function TeamContributorsColumns({
  teamId,
}: TeamContributorsColumnsProps) {
  const contributorsColumns: ColumnDef<ContributorDto>[] = [
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
      accessorKey: "contributionScorePercentage",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center"
          >
            Impact
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const contributor = row.original;
        return (
          <div className="text-xl font-bold text-left pl-4">
            {contributor.contributionScorePercentage.toFixed(2) + "%"}
          </div>
        );
      },
    },
    {
      accessorKey: "contributionScore",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Contribution Score
            <ArrowUpDown className="ml-2 h-4 w-4 flex items-center" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const contributor = row.original;
        return (
          <div className="text-xl font-bold text-left pl-14">
            {contributor.contributionScore.toFixed(2)}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const contributor = row.original;
        const router = useRouter();
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
              <DropdownMenuItem
                onClick={() => {
                  router.push(
                    `/teams/${teamId}/contributors/${contributor.userName}`,
                  );
                }}
              >
                View contributor details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return contributorsColumns;
}
