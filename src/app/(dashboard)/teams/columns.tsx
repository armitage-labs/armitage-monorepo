"use client";

import axios from "axios";
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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Circles } from "react-loader-spinner";
import { Team } from "@/app/api/teams/fetchUserTeams";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "@/components/icons";

export const teamsColumns: ColumnDef<Team>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-left"> Name </div>,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-left">
          {new Date(row.getValue("created_at")).toLocaleString()}
        </div>
      );
    },
  },
  {
    id: "status",
    header: () => <div className="text-left"> Status </div>,
    cell: () => {
      return <div className="text-left">Active</div>;
    },
  },
  {
    id: "details",
    cell: ({ row }) => {
      const team = row.original;
      const router = useRouter();
      return (
        <div className="">
          <Button
            variant={"secondary"}
            className="text-xs md:text-sm"
            onClick={() => {
              router.push(`/teams/${team.id}`);
            }}
          >
            <Icons.lineChart className="mr-2 h-4 w-4" /> Team details
          </Button>
        </div>);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const team = row.original;
      const [isLoading, setIsLoading] = useState(false);
      const handleGenerateReport = async () => {
        setIsLoading(true);
        const { data } = await axios.get(`/api/credmanager?team_id=${team.id}`);
        if (data && data.success) {
          router.push(`/teams/${team.id}`);
        } else {
          setIsLoading(false);
        }
      };

      return (
        <AlertDialog>
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
                  router.push(`/teams/${team.id}`);
                }}
              >
                View team details
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Calculate contributions</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            {isLoading ? (
              <div className="flex justify-center">
                <Circles color="black" />
              </div>
            ) : (
              <div>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action can take several minutes to complete and will override previous calculations, making them unavailable until the new report is generated.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="pt-6">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button onClick={handleGenerateReport}>Continue</Button>
                </AlertDialogFooter>
              </div>
            )}
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
