"use client";

import axios from "axios";
import React from "react";

import { UserCredDto } from "@/app/api/credmanager/route";
import BreadCrumb from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Team } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Circles, ThreeDots } from "react-loader-spinner";
import { CalculationResult } from "../../gitrepo/calculationResults";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Github from "next-auth/providers/github";
import { GithubRepoList } from "@/components/githubRepoList";

interface PageProps {
  params: { teamId: string };
}

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

  useEffect(() => {
    setIsLoading(true);
    if (session?.userId) {
      handleFetchTeams();
      handleFetchUserCreds();
      handleFetchRegisteredRepos();
    }
  }, [session]);

  useEffect(() => {
    if (team && userCredDtos.length > 0 && registeredGitRepos.length > 0) {
      setIsLoading(false);
    }
  }, [registeredGitRepos, team, userCredDtos]);

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
          {isLoading ? (
            <ThreeDots color="black" />
          ) : (
            <Heading
              title={team ? team.name : ""}
              description={`View the details of your team`}
            />
          )}
        </div>
        <Separator />

        {isLoading ? (
          <div className="pt-36 flex justify-center">
            <Circles color="black" />
          </div>
        ) : (
          <div>
            <div className="pt-16 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 md:col-span-3">
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

              <div className="">
                <CalculationResult
                  userCredDtoList={userCredDtos.filter((user) => user.type === "USER")}
                ></CalculationResult>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
