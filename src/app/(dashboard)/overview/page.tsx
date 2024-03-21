"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { ContributorDto } from "@/app/api/contributors/fetchUserContributors";
import { TopContributorsDataTable } from "./top-contributors-data-table";
import { topContributorsColumns } from "./top-contributors-columns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import axios from "axios";
import { Icons } from "@/components/icons";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { toast } from "sonner";
import { OverviewDto } from "@/app/api/teams/types/overview.dto";
import { DashboardInsights } from "@/components/overview/dashboardInsights";
import { productTourData } from "@/content/product-tour";
import { TeamIntervalsOverview } from "@/components/overview/teamIntervalsOverview";
import { TeamIntervalsOverviewDto } from "@/app/api/teams/overview/intervals/route";
import { LoadingCircle } from "@/components/navigation/loading";

export default function OverviewPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [topContributors, setTopContributors] = useState<ContributorDto[]>([]);
  const [hasSeenProductTour, setHasSeenProductTour] = useState(true);
  const [overview, setOverview] = useState<OverviewDto>();
  const [teamIntervalsOverview, setTeamIntervalsOverview] = useState<
    TeamIntervalsOverviewDto[]
  >([]);

  useEffect(() => {
    if (session?.githubLogin) {
      setIsLoading(false);
      handleFetchContributors();
      handleFetchProductTour();
      handleFetchOverview();
      handleFetchTeamIntervalsOverview();
    }
  }, [session]);

  const handleFetchTeamIntervalsOverview = async () => {
    const { data } = await axios.get("/api/teams/overview/intervals");
    if (data.success) {
      setTeamIntervalsOverview(data.teamOverviewIntervals);
    }
  };

  const handleFetchProductTour = async () => {
    const { data } = await axios.get("/api/tour");
    if (data.success) {
      setHasSeenProductTour(data.hasSeenProductTour);
    }
  };

  const handleFetchOverview = async () => {
    const { data } = await axios.get("/api/overview");
    if (data.success) {
      setOverview(data.overview);
    }
  };

  const handleFetchContributors = async () => {
    const { data } = await axios.get("/api/contributors");
    if (data.success) {
      const rankedContributors = data.contributors.sort(
        compareByContributionScore,
      );
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
    steps: productTourData,
  });

  useEffect(() => {
    if (!hasSeenProductTour) {
      driverObj.drive();
    }
  }, [hasSeenProductTour]);

  useEffect(() => {
    if (!isLoading) {
      toast(
        "Welcome to Armitage Beta! The product is still in development, so please be patient with us! We appreciate all feedback and bug reports!",
      );
    }
  }, [isLoading]);

  return (
    <div>
      {isLoading ? (
        <div className="flex pt-40 justify-center items-center">
          <LoadingCircle></LoadingCircle>
        </div>
      ) : (
        <ScrollArea className="h-full">
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                Hi, Welcome back {session?.githubLogin} 👋
              </h2>
            </div>
            <div>
              <Alert>
                <Icons.gitHub className="mr-2 h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  If you want to use Armitage with private repos, you can
                  install the Armitage GitHub App from the{" "}
                  <a className="text-link " href={`/settings`}>
                    Settings
                  </a>
                </AlertDescription>
              </Alert>
            </div>

            <DashboardInsights overview={overview}></DashboardInsights>

            {teamIntervalsOverview.length !== 0 && (
              <TeamIntervalsOverview
                teamIntervalsOverview={teamIntervalsOverview}
              ></TeamIntervalsOverview>
            )}

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
