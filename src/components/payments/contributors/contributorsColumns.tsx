"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ContributorDto } from "@/app/api/contributors/fetchUserContributors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PaymentSlider from "./paymentSlider";

export const ProjectContributorsColumns: ColumnDef<ContributorDto>[] = [
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
    accessorKey: "contributionScorePercentage",
    header: () => {
      return <></>;
    },
    cell: ({ row }) => {
      const contributor = row.original;
      return (
        <div className="text-xl font-bold text-left pl-4">
          {contributor.contributionScorePercentage.toFixed(2) + "%"}
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
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex ">
          {/* <Slider
            defaultValue={[5]}
            max={10}
            min={1}
            step={1}
            onValueChange={(value) => console.log(value)}
          /> */}
          <PaymentSlider
            onChange={() => console.log("I change")}
          ></PaymentSlider>
        </div>
      );
    },
  },
];
