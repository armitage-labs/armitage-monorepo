"use client";

import { Circles } from "react-loader-spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { ContributorDto } from "@/app/api/contributors/fetchUserContributors";
import { TopContributorsDataTable } from "./top-contributors-data-table";
import { topContributorsColumns } from "./top-contributors-columns";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OverviewPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [contributors, setContributors] = useState<ContributorDto[]>([]);
  const [topContributors, setTopContributors] = useState<ContributorDto[]>([]);

  useEffect(() => {
    if (session?.githubLogin) {
      setIsLoading(false);
      handleFetchContributors();
    }
  }, [session]);

  const handleFetchContributors = async () => {
    const { data } = await axios.get("/api/contributors");
    if (data.success) {
      const rankedContributors = data.contributors.sort(
        compareByContributionScore,
      );
      setContributors(rankedContributors);
      if (data.contributors.length > 3) {
        setTopContributors(rankedContributors.slice(0, 3));
      } else {
        setTopContributors(rankedContributors);
      }
      setIsLoading(false);
    }
  };

  const compareByContributionScore = (
    first: ContributorDto,
    second: ContributorDto,
  ) => {
    return second.contributionScore - first.contributionScore;
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex pt-40 justify-center items-center">
          <Circles color="slate" />
        </div>
      ) : (
        <ScrollArea className="h-full">
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                Hi, Welcome back {session?.githubLogin} 👋
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total number contributors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {contributors.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +0% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-5">
                <CardHeader>
                  <CardTitle>Top contributors</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <TopContributorsDataTable
                    columns={topContributorsColumns}
                    data={topContributors}
                  ></TopContributorsDataTable>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
