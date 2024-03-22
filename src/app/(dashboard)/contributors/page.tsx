"use client";

import BreadCrumb from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ContributorsDataTable } from "./data-table";
import { contributorsColumns } from "./columns";
import { ContributorDto } from "@/app/api/contributors/fetchUserContributors";
import { LoadingCircle } from "@/components/navigation/loading";

const breadcrumbItems = [
  { title: "Contributors", link: "/dashboard/contributors" },
];

export default function GitRepo() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [contributors, setContributors] = useState<ContributorDto[]>([]);

  const handleFetchUserContributors = async () => {
    const { data } = await axios.get("/api/contributors");
    if (data.success) {
      setContributors(data.contributors);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.userId) {
      handleFetchUserContributors();
    }
  }, [session]);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Contributors (${contributors.length})`}
            description={`See who are your rockstar contributors!`}
          />
        </div>
        <Separator />

        {isLoading ? (
          <div className="pt-36 flex justify-center">
            <LoadingCircle></LoadingCircle>
          </div>
        ) : (
          <ContributorsDataTable
            columns={contributorsColumns}
            data={contributors}
          ></ContributorsDataTable>
        )}
      </div>
    </>
  );
}
