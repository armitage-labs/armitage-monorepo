"use client";

import { ContributorDetailsDto } from "@/app/api/contributors/details/fetchContributorDetails";
import BreadCrumb from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Team } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import UserActivityRpcCard from "./userActivityRpcCard";

interface ContributorDetailsPageProps {
  params: { teamId: string; contributorUserName: string };
}

export default function ContributorDetailsPage({
  params,
}: ContributorDetailsPageProps) {
  const teamId = params.teamId;
  const contributorUserName = params.contributorUserName;

  const [team, setTeam] = useState<Team>();
  const [contributorDetails, setContributorDetails] =
    useState<ContributorDetailsDto>();

  const breadcrumbItems = [
    { title: "Teams", link: "/teams" },
    { title: team?.name ?? "Team Details", link: `/teams/${params.teamId}` },
    { title: "Contributor", link: `/teams/${params.teamId}` },
  ];

  const handleFetchTeams = async () => {
    const { data } = await axios.get("/api/teams?team_id=" + params.teamId);
    if (data.success) {
      setTeam(data.userTeams[0]);
    }
  };

  const handleFetchContributorDetails = async () => {
    const { data } = await axios.get(`/api/repositories?team_id=${teamId}`);
    if (data.success) {
      setContributorDetails(data.contributorDetails);
    }
  };
  useEffect(() => {
    if (contributorUserName) {
      handleFetchTeams();
      handleFetchContributorDetails();
    }
  }, []);

  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading
          title={contributorUserName}
          description={`View the details of your contributor`}
        />
      </div>
      <Separator />

      <div>
        <div className="pt-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-3 md:col-span-3">
            <div className="pb-5">
              <UserActivityRpcCard
                teamId={teamId}
                contributorUserName={contributorUserName}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
