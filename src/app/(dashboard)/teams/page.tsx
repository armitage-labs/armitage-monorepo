"use client";

import { Team } from "@/app/api/teams/fetchUserTeams";
import BreadCrumb from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TeamsTable } from "./data-table";
import { teamsColumns } from "./columns";
import { LoadingCircle } from "@/components/navigation/loading";

const breadcrumbItems = [{ title: "Teams", link: "/dashboard/teams" }];

export default function TeamsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const router = useRouter();

  const handleFetchUserTeams = async () => {
    const { data } = await axios.get("/api/teams");
    if (data.success) {
      setTeams(data.userTeams);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.userId) {
      handleFetchUserTeams();
    }
  }, [session]);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Teams (${teams.length})`}
            description={`Manage your teams or create a new one`}
          />
          <Button
            className="text-xs md:text-sm"
            onClick={() => router.push(`/teams/new`)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <Separator />

        {isLoading ? (
          <div className="pt-36 flex justify-center">
            <LoadingCircle></LoadingCircle>
          </div>
        ) : (
          <TeamsTable columns={teamsColumns} data={teams}></TeamsTable>
        )}
      </div>
    </>
  );
}
