import BreadCrumb from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React from "react";

interface PageProps {
  params: { teamId: string };
}

export default function Page({ params }: PageProps) {
  const teamId = params.teamId;
  const breadcrumbItems = [
    { title: "Teams", link: "/teams" },
    { title: "Team details", link: `/teams/${teamId}` },
  ];
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Team details`} description="" />
        </div>
        <Separator />
      </div>
    </>
  );
}
