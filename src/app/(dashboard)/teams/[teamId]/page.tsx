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
import { Circles } from "react-loader-spinner";
import { CalculationResult } from "../../gitrepo/calculationResults";
import { CalculationIntervalChart } from "./calculationIntervalChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GithubRepoList } from "@/components/githubRepoList";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { TeamCalculationCreated } from "@/components/teams/teamCalculationCreated";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PageProps {
  params: { teamId: string };
}

type UserTooltipDto = {
  id: number;
  userName: string;
  totalCred: number;
  type: string;
};

export default function Page({ params }: PageProps) {
  const teamId = params.teamId;
  const breadcrumbItems = [
    { title: "Teams", link: "/teams" },
    { title: "Team details", link: `/teams/${teamId}` },
  ];
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState<Team>();
  const [userCredDtos, setUserCredDtos] = useState<UserCredDto[]>([]);
  const [registeredGitRepos, setRegisteredGitRepos] = useState([]);
  const [userTooltipDto, setUserTooltipDto] = useState<UserTooltipDto[]>([]);
  const [hasContributionRequest, setHasContributionRequest] = useState(false);
  const [contributionCalculation, setContributionCalculation] =
    useState<ContributionCalculation>();

  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    if (session?.userId) {
      handleFetchTeams();
      handleFetchUserCreds();
      handleFetchRegisteredRepos();
      handleFetchContributionRequest();
      handleFetchContributionCalculation();
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
    }
  };

  const handleFetchTeams = async () => {
    const { data } = await axios.get("/api/teams?team_id=" + teamId);
    if (data.success) {
      setTeam(data.userTeams[0]);
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

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={team ? team.name : ""}
            description={`View the details of your team`}
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
                  router.push("/teams");
                }}
              >
                Return to teams
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {isLoading ? (
              <div className="pt-36 flex justify-center">
                <Circles color="black" />
              </div>
            ) : (
              <div>
                <div className="pt-16 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  <div className="col-span-3 md:col-span-3">
                    <CalculationIntervalChart
                      intervals={
                        contributionCalculation?.score_interval as any[]
                      }
                    ></CalculationIntervalChart>
                  </div>
                </div>
                <div className="pt-16 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="col-span-1 md:col-span-1">
                    <CardHeader>
                      <CardTitle>Github Repositories</CardTitle>
                      <CardDescription>
                        You have {registeredGitRepos.length} github repositories
                        registered
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <GithubRepoList githubRepos={registeredGitRepos} />
                    </CardContent>
                  </Card>

                  <div className="col-span-2 md:col-span-2">
                    <CalculationResult
                      userCredDtoList={userCredDtos.filter(
                        (user) => user.type === "USER",
                      )}
                    ></CalculationResult>
                  </div>
                </div>

                <div className="pt-16">
                  <div className="flex flex-row items-center justify-center mb-10 w-full">
                    <AnimatedTooltip
                      items={userTooltipDto.filter(
                        (user) => user.type === "USER",
                      )}
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
