"use client";

import axios from "axios";
import React from "react";

import BreadCrumb from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CalculationResult } from "../../gitrepo/calculationResults";
import { Circles } from "react-loader-spinner";
import { Team } from "@prisma/client";
import { UserCredDto } from "@/app/api/credmanager/route";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [team, setTeam] = useState<Team>();
  const [userCredDtos, setUserCredDtos] = useState<UserCredDto[]>([]);

  useEffect(() => {
    setIsLoading(true);
    if (session?.userId) {
      handleFetchTeams();
      handleFetchUserCreds();
    }
  }, [session]);

  const handleFetchTeams = async () => {
    const { data } = await axios.get("/api/teams?team_id=" + teamId);
    if (data.success) {
      setTeam(data.userTeams[0]);
      setIsLoading(false);
    }
  };

  const handleFetchUserCreds = async () => {
    const { data } = await axios.get(`/api/cred?team_id=${teamId}`);
    if (data.success) {
      setUserCredDtos(data.userCreds);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        {isLoading ? (
          <div className="pt-36 flex justify-center">
            <Circles color="black" />
          </div>
        ) : (
          <div className="flex items-start justify-between">
            {team ? (
              <div>
                <Heading title={team.name} description="" />
                <div className="pt-36 flex justify-center">
                  <CalculationResult
                    userCredDtoList={userCredDtos}
                  ></CalculationResult>
                </div>
              </div>
            ) : (
              <Heading title="Team not found" description="" />
            )}
          </div>
        )}
        <Separator />
      </div>
    </>
  );
}
