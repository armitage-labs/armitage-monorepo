"use client";

import BreadCrumb from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Team } from "@prisma/client";
import { RepositoryTeamCard } from "@/components/repositoryTeamCard";
import { Skeleton } from "@/components/ui/skeleton";

const breadcrumbItems = [
  { title: "Repositories", link: "/dashboard/repositories" },
];

export default function TeamsPage() {
  const [repositoryTeams, setRepositoryTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleQueryRepositoryTeams = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`/api/repositories`);
    if (data.success && data.userTeams) {
      setRepositoryTeams(data.userTeams);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleQueryRepositoryTeams();
  }, []);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Repositories`}
            description={`Manage your repositories or create a new one`}
          />
          <Button
            className="text-xs md:text-sm"
            onClick={() => router.push(`/repositories/new`)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <Separator />
        {!isLoading ? (
          <div>
            {repositoryTeams.length !== 0 && (
              <div className="grid gap-4 lg:grid-cols-2">
                {repositoryTeams.map((team) => {
                  return (
                    <div>
                      <RepositoryTeamCard teamDto={team}></RepositoryTeamCard>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {[...Array(10)].map((_elementInArray, _index) => (
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[165px] w-full rounded-xl" />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
