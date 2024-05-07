"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, StopCircle, XCircle } from "lucide-react";
import { PaymentSplitDto } from "@/app/api/payments/service/paymentSplitsService";

export const PaymentSplitsColumns: ColumnDef<PaymentSplitDto>[] = [
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
    header: () => <></>,
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
          {(data.paymentSplit ?? 0).toFixed(2) + "%"}
        </div>
      );
    },
  },

  {
    accessorKey: "walletAddress",
    header: () => {
      return <></>;
    },
    cell: ({ row }) => {
      const contibutor = row.original;
      return (
        <div className="text-xl font-bold text-left pl-4">
          {contibutor.walletAddress != null ? (
            <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="mr-2 h-5 w-5 text-red-500" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "contributionScore",
    header: () => {
      return <></>;
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
  // { TODO comming soon
  //   id: "actions",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex ">
  //         <PaymentSlider
  //           onChange={() => console.log("I change")}
  //         ></PaymentSlider>
  //       </div>
  //     );
  //   },
  // },
];
