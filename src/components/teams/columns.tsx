"use client";

import axios from "axios";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Icons } from "../icons";
import { stringToColour } from "@/lib/utils";

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
    cell: ({ row }) => {
      return (
        <div className="flex">
          <span
            className={`h-4 w-4 rounded-full`}
            style={{
              backgroundColor: `${stringToColour(row.getValue("name"))}`,
            }}
          ></span>
          <div className="pl-3">
            {row.getValue("name")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: () => {
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
    header: () => {
      return <div>Stars</div>;
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("stars")}</div>;
    },
  },
  {
    accessorKey: "forks",
    header: () => {
      return <div>Forks</div>;
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("forks")}</div>;
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      return <div className="flex">
        <div className="h-5 w-5"><Icons.gitHub></Icons.gitHub></div>
        <div className="pl-3">{row.getValue("owner")}</div>
      </div>;
    }
  },
];
