"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

export type GitRepoView = {
  id: string;
  name: string;
  full_name: string;
  stars: number;
  owner: string;
  forks: number;
  created_at: string;
  html_url: string;
  initially_registered: boolean;
  team_id: string;
};

export const columns: ColumnDef<GitRepoView>[] = [
  {
    id: "select",
    header: () => <div className="text-left"> Registered </div>,
    cell: ({ row }) => {
      const repo = row.original;
      const [checked, setChecked] = useState<boolean>();

      useEffect(() => {
        const registered = repo.initially_registered;
        setChecked(registered);
      }, [row]);

      const handleRegisterRepo = async (register: boolean) => {
        if (register) {
          const { data } = await axios.post(`/api/github/repo`, {
            name: repo.name,
            full_name: repo.full_name,
            team_id: repo.team_id,
          });
          if (data.success) {
            repo.initially_registered = true;
            setChecked(true);
          }
        } else {
          const { data } = await axios.delete(
            `/api/github/repo?full_name=${repo.full_name}&team_id=${repo.team_id}`,
          );
          if (data.success) {
            repo.initially_registered = false;
            setChecked(false);
          }
        }
      };

      return (
        <div className="pl-6 text-left">
          <Checkbox
            checked={checked}
            onCheckedChange={(value) => {
              handleRegisterRepo(!!value);
            }}
            aria-label="Select row"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => <div className="text-left"> Name </div>,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <div>Created At</div>;
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
    accessorKey: "stars",
    header: ({ column }) => {
      return <div>Stars</div>;
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("stars")}</div>;
    },
  },
  {
    accessorKey: "forks",
    header: ({ column }) => {
      return <div>Forks</div>;
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("forks")}</div>;
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
];
