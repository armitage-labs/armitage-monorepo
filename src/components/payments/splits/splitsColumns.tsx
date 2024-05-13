"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { truncateString } from "@/app/(dashboard)/utils/stringUtils";
import { SplitRecipient } from "./splitsRecipients";

export const SplitsColumns: ColumnDef<SplitRecipient>[] = [
  {
    id: "avatar",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div>
          {data.username ? (
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://github.com/${data.username}.png?size=100`}
                alt={data.address}
              />
              <AvatarFallback>{data.address}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://avatars.jakerunzer.com/${data.address}`}
                alt={data.address}
              />
              <AvatarFallback>{data.address}</AvatarFallback>
            </Avatar>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "wallet",
    header: () => <></>,
    cell: ({ row }) => {
      const reciepted = row.original;
      return (
        <div className="">
          {reciepted.username ? (
            <> {reciepted.username}</>
          ) : (
            <>{truncateString(reciepted.address, 6)}</>
          )}
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
