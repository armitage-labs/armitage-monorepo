"use client";

import axios from "axios";
import React from "react";

import { UserCredDto } from "@/app/api/credmanager/route";
import BreadCrumb from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Team, ContributionCalculation } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CalculationResult } from "../../gitrepo/calculationResults";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { TeamCalculationCreated } from "@/components/teams/teamCalculationCreated";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { OverviewDto } from "@/app/api/teams/types/overview.dto";
import { LoadingCircle } from "@/components/navigation/loading";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { TeamInsights } from "../../teams/[teamId]/teamInsights";
import { CalculationIntervalChart } from "../../teams/[teamId]/calculationIntervalChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamContributionTable } from "../../teams/[teamId]/teamContributionTable";

interface PageProps {
  params: { repositoryId: string };
}

type UserTooltipDto = {
  id: number;
  userName: string;
  totalCred: number;
  type: string;
};

export default function TeamDetailsPage({ params }: PageProps) {
  const teamId = params.repositoryId;
  const breadcrumbItems = [
    { title: "Repositories", link: "/repositories" },
    { title: "Repository details", link: `/repositories/${teamId}` },
  ];
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [emptyTeam, setEmptyTeam] = useState(false);
  const [team, setTeam] = useState<Team>();
  const [overview, setOverview] = useState<OverviewDto>();
  const [userCredDtos, setUserCredDtos] = useState<UserCredDto[]>([]);
  const [registeredGitRepos, setRegisteredGitRepos] = useState([]);
  const [userTooltipDto, setUserTooltipDto] = useState<UserTooltipDto[]>([]);
  const [hasContributionRequest, setHasContributionRequest] = useState(false);
  const [contributionCalculation, setContributionCalculation] =
    useState<ContributionCalculation>();
  const [pollingCount, setPollingCount] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    if (session?.userId) {
      handleFetchTeams();
      handleFetchUserCreds();
      handleFetchRegisteredRepos();
      handleFetchContributionRequest();
      handleFetchContributionCalculation();
      handleFetchTeamOverview();
    }
  }, [session]);

  useEffect(() => {
    if (team && userCredDtos.length > 0 && registeredGitRepos.length > 0) {
      setIsLoading(false);
    }
  }, [registeredGitRepos, team, userCredDtos]);

  const handleFetchContributionRequest = async () => {
    const { data } = await axios.get(
      `/api/contribution-request?team_id=${teamId}`,
    );
    if (data.success) {
      setHasContributionRequest(data.hasContributionRequest);
    }
  };

  const handleFetchContributionCalculation = async () => {
    const { data } = await axios.get(
      `/api/contribution-calculation?team_id=${teamId}`,
    );
    if (data.success) {
      setContributionCalculation(data.contributionCalculation);
    }
  };

  const handleFetchRegisteredRepos = async () => {
    const { data } = await axios.get(
      `/api/github/repo/registered?team_id=${teamId}`,
    );
    if (data.success) {
      setRegisteredGitRepos(data.registeredRepos);
      if (data.registeredRepos.length == 0) {
        setEmptyTeam(true);
      }
    }
  };

  const handleFetchTeams = async () => {
    const { data } = await axios.get("/api/teams?team_id=" + teamId);
    if (data.success) {
      setTeam(data.userTeams[0]);
    }
  };

  const handleFetchTeamOverview = async () => {
    const { data } = await axios.get("/api/teams/overview?team_id=" + teamId);
    if (data.success) {
      setOverview(data.overview);
    }
  };

  useEffect(() => {
    if (userCredDtos.length > 0) {
      let index = 0;
      const userTooltipDtoArray = userCredDtos.map((userCredDto) => {
        index++;
        return {
          id: index,
          userName: userCredDto.userName,
          totalCred: userCredDto.totalCred,
          type: userCredDto.type,
        };
      });
      setUserTooltipDto(userTooltipDtoArray);
    }
  }, [userCredDtos]);

  const handleFetchUserCreds = async () => {
    const { data } = await axios.get(`/api/cred?team_id=${teamId}`);
    if (data.success) {
      setUserCredDtos(data.userCreds);
    }
  };

  useEffect(() => {
    if (hasContributionRequest) {
      const delayDebounceFn = setTimeout(() => {
        handleFetchContributionRequest();
        setPollingCount(pollingCount + 1);
      }, 5000);
      return () => clearTimeout(delayDebounceFn);
    } else if (pollingCount > 0 && !hasContributionRequest) {
      handleFetchTeams();
      handleFetchUserCreds();
      handleFetchRegisteredRepos();
      handleFetchContributionCalculation();
      handleFetchTeamOverview();
    }
  }, [hasContributionRequest, pollingCount]);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={team ? team.name : ""}
            description={`View the details of your repository`}
          />
        </div>
        <Separator />

        {hasContributionRequest ? (
          <div>
            <div className="pt-16 flex justify-center">
              <TeamCalculationCreated></TeamCalculationCreated>
            </div>
            <div className="pt-16 flex justify-center">
              <Button
                variant="default"
                onClick={() => {
                  router.push("/repositories");
                }}
              >
                Return to repositories
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {isLoading ? (
              <div className="pt-36 flex justify-center">
                {emptyTeam ? (
                  <div className="pl-36 pr-36 flex justify-center">
                    <TextGenerateEffect words="Seems like there are no github repositories on this team, fix this by clicking on the manage repositories button above." />
                  </div>
                ) : (
                  <LoadingCircle></LoadingCircle>
                )}
              </div>
            ) : (
              <div>
                <TeamInsights overview={overview}></TeamInsights>

                <div className="pt-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  <div className="col-span-3 md:col-span-3">
                    <CalculationIntervalChart
                      intervals={
                        contributionCalculation?.score_interval as any[]
                      }
                    ></CalculationIntervalChart>
                  </div>
                </div>
                <div className="pt-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  <div className="col-span-3 md:col-span-3">
                    <Card className="col-span-2">
                      <Tabs defaultValue="graph" className="w-full">
                        <CardHeader>
                          <CardTitle className="grid grid-cols-2">
                            <div>Contributors</div>
                            <TabsList className="grid grid-cols-2 justify-end">
                              <TabsTrigger value="graph">Graph</TabsTrigger>
                              <TabsTrigger value="table">Table</TabsTrigger>
                            </TabsList>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                          <TabsContent value="graph">
                            <CalculationResult
                              userCredDtoList={userCredDtos
                                .filter((user) => user.type === "USER")
                                .sort((a, b) => b.totalCred - a.totalCred)}
                            ></CalculationResult>
                          </TabsContent>
                          <TabsContent value="table">
                            <TeamContributionTable
                              teamId={teamId}
                            ></TeamContributionTable>
                          </TabsContent>
                        </CardContent>
                      </Tabs>
                    </Card>
                  </div>
                </div>

                <div className="pt-16">
                  <div className="flex flex-row items-center justify-center mb-10 w-full">
                    <AnimatedTooltip
                      items={userTooltipDto
                        .filter((user) => user.type === "USER")
                        .sort((a, b) => b.totalCred - a.totalCred)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
