"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Recipients } from "../paymentView";

export const SplitsColumns: ColumnDef<Recipients>[] = [
  {
    id: "avatar",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div>
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://avatars.jakerunzer.com/${data.recipient.address}`}
              alt={data.recipient.address}
            />
            <AvatarFallback>{data.recipient.address}</AvatarFallback>
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
      return (
        <div className="">
          {data.recipient.address}
        </div>
      );
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
