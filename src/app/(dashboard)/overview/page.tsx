"use client";

import { Circles } from "react-loader-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { ContributorDto } from "@/app/api/contributors/fetchUserContributors";
import { TopContributorsDataTable } from "./top-contributors-data-table";
import { topContributorsColumns } from "./top-contributors-columns";
import { useEffect, useState } from "react";
import axios from "axios";
import { Icons } from "@/components/icons";
import { RegisteredGitRepo } from "@/app/api/github/repo/all/fetchAllUserRepos";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { toast } from "sonner";

export default function OverviewPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [contributors, setContributors] = useState<ContributorDto[]>([]);
  const [topContributors, setTopContributors] = useState<ContributorDto[]>([]);
  const [credSum, setCredSum] = useState<number>(0);
  const [userRepos, setUserRepos] = useState<RegisteredGitRepo[]>([]);
  const [hasSeenProductTour, setHasSeenProductTour] = useState(true);

  useEffect(() => {
    if (session?.githubLogin) {
      setIsLoading(false);
      handleFetchContributors();
      handleFetchCredSum();
      handleFetchUserRepos();
      handleFetchProductTour();
    }
  }, [session]);

  const handleFetchProductTour = async () => {
    const { data } = await axios.get("/api/tour");
    if (data.success) {
      setHasSeenProductTour(data.hasSeenProductTour);
    }
  };

  const handleFetchCredSum = async () => {
    const { data } = await axios.get("/api/cred/sum");
    if (data.success) {
      setCredSum(data.credSum);
    }
  };

  const handleFetchUserRepos = async () => {
    const { data } = await axios.get("/api/github/repo/all");
    if (data.success) {
      setUserRepos(data.registeredRepos);
    }
  };

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

  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        popover: {
          title: "Welcome to Armitage!",
          description:
            "Thank you for trying Armitage! We are still a prototype but we hope you find it useful!",
          side: "left",
          align: "start",
        },
      },
      {
        popover: {
          title: "Let's get started",
          description:
            "To start measuring impact, you need to create a team and assign repositories to that specific team",
          side: "left",
          align: "start",
        },
      },
      {
        element: 'a[href="/teams"]',
        popover: {
          title: "Teams",
          description:
            "You can create a team on the Teams tab, by clicking the Add New button on the top right corner",
          side: "left",
          align: "start",
        },
      },
      {
        popover: {
          title: "Team details",
          description:
            "Analyzing a team impact can take a couple of minutes, so take a cup of tea and relax, after it finishes calculating, you can see the results on the team details page",
          side: "left",
          align: "start",
        },
      },
      {
        element: 'a[href="/contributors"]',
        popover: {
          title: "Contributors",
          description:
            "You can also see all engineers of all your teams on the Contributors page, with scores that compare their impact with all your other teams",
          side: "left",
          align: "start",
        },
      },
      {
        popover: {
          title: "Get to the impact!",
          description: "And that is all, go ahead and start having fun!",
        },
      },
    ],
  });

  useEffect(() => {
    if (!hasSeenProductTour) {
      driverObj.drive();
    }
  }, [hasSeenProductTour]);

  useEffect(() => {
    if (!isLoading) {
      toast("Welcome to Armitage Beta! The product is still in development, so please be patient with us! We appreciate all feedback and bug reports!");
    }
  }, [isLoading]);

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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total contributors
                  </CardTitle>
                  <Icons.users></Icons.users>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {contributors.length}
                  </div>
                  <p className="pt-1 text-xs text-muted-foreground">
                    {/* +15% from last month */}
                    All contributors on all your teams
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total CRED earned
                  </CardTitle>
                  <Icons.pizza></Icons.pizza>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{credSum.toFixed(2)}</div>
                  <p className="pt-1 text-xs text-muted-foreground">
                    {/* +8% from last week */}
                    All CRED earned on all your teams
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total repositories
                  </CardTitle>
                  <Icons.gitBranch></Icons.gitBranch>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{userRepos.length}</div>
                  <p className="pt-1 text-xs text-muted-foreground">
                    {/* +8% from last week */}
                    All Github Repositories registered on all teams
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-7">
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
