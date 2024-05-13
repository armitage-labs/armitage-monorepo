"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { truncateString } from "@/app/(dashboard)/utils/stringUtils";
import { SplitRecipient } from "./splitsRecipients";

export const SplitsColumns: ColumnDef<SplitRecipient>[] = [
  {
    id: "avatar",
    cell: ({ row }) => {
      const reciepted = row.original;
      const isArmitage =
        reciepted.address == "0xB5685343eD45D8b896633F9c128C55F758feb0aA";
      if (isArmitage) {
        reciepted.username = "armitage-lab";
      }
      return (
        <div>
          {reciepted.username ? (
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://github.com/${reciepted.username}.png?size=100`}
                alt={reciepted.address}
              />
              <AvatarFallback>{reciepted.address}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://avatars.jakerunzer.com/${reciepted.address}`}
                alt={reciepted.address}
              />
              <AvatarFallback>{reciepted.address}</AvatarFallback>
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
      const isArmitage =
        reciepted.address == "0xB5685343eD45D8b896633F9c128C55F758feb0aA";
      return (
        <div className="">
          {isArmitage ? (
            <>Armitage Labs</>
          ) : (
            <>
              {reciepted.username ? (
                <> {reciepted.username}</>
              ) : (
                <>{truncateString(reciepted.address, 6)}</>
              )}
            </>
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
