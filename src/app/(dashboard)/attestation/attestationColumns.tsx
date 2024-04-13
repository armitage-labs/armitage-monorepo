"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AttestationDto } from "@/app/api/attestations/service";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const attestationColumns: ColumnDef<AttestationDto>[] = [
  {
    accessorKey: "uuid",
    cell: ({ row }) => {
      const attestation = row.original;
      return (
        <div className="text-left pl-4 truncate w-96">
          {attestation.attestation_uuid}
        </div>
      );
    },
  },
  {
    accessorKey: "team_id",
    header: () => {
      return <>Team ID</>;
    },
    cell: ({ row }) => {
      return <div className="text-left">{row.getValue("team_id")}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: () => {
      return <>Created At</>;
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
    id: "generate",
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
            Generate proofs
          </Button>
        </div>
      );
    },
  },
];
