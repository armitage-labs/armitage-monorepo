"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ContributorDto } from "@/app/api/contributors/fetchUserContributors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const topContributorsColumns: ColumnDef<ContributorDto>[] = [
  {
    id: "rank",
    header: () => <div className="text-left"> # </div>,
    cell: ({ row }) => {
      const rank = row.index;
      return (
        <div className="text-2xl">
          {rank == 0 ? (
            <div>🥇</div>
          ) : rank === 1 ? (
            <div>🥈</div>
          ) : rank === 2 ? (
            <div>🥉</div>
          ) : (
            <div></div>
          )}
        </div>
      );
    },
  },
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
    header: () => <div className="text-left"> Impact </div>,
    cell: ({ row }) => {
      const contributor = row.original;
      return (
        <div className="text-xl font-bold">
          {contributor.contributionScorePercentage.toFixed(2) + "%"}
        </div>
      );
    },
  },
];
