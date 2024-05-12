"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SplitRecipient } from "@0xsplits/splits-sdk-react";

export const SplitsColumns: ColumnDef<SplitRecipient>[] = [
  {
    id: "avatar",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div>
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://avatars.jakerunzer.com/${data.address}`}
              alt={data.address}
            />
            <AvatarFallback>{data.address}</AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: "wallet",
    header: () => <></>,
    cell: ({ row }) => {
      const data = row.original;
      return <div className="">{data.address}</div>;
    },
  },
  {
    accessorKey: "paymentSplits",
    header: () => {
      return <></>;
    },
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="text-xl font-bold text-left pl-4">
          {(data.percentAllocation ?? 0).toFixed(2) + "%"}
        </div>
      );
    },
  },
];
