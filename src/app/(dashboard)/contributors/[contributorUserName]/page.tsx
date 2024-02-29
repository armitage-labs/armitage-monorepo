"use client";

import { ContributorDetailsDto } from "@/app/api/contributors/details/fetchContributorDetails";
import BreadCrumb from "@/components/breadcrumbs";
import { GithubRepoList } from "@/components/githubRepoList";
import { TeamCardList } from "@/components/teamCardList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface ContributorDetailsPageProps {
  params: { contributorUserName: string };
}

export default function ContributorDetailsPage({
  params,
}: ContributorDetailsPageProps) {
  const contributorUserName = params.contributorUserName;
  const breadcrumbItems = [
    { title: "Contributors", link: "/contributors" },
    {
      title: "Contributor details",
      link: `/contributors/${contributorUserName}`,
    },
  ];
  const [contributorDetails, setContributorDetails] =
    useState<ContributorDetailsDto>();

  useEffect(() => {
    if (contributorUserName) {
      handleFetchContributorDetails();
    }
  }, []);

  const handleFetchContributorDetails = async () => {
    const { data } = await axios.get(
      "/api/contributors/details?contributor_username=" + contributorUserName,
    );
    console.log("fetched");
    console.log(data);
    if (data.success) {
      setContributorDetails(data.contributorDetails);
    }
  };

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

      <div className="pt-16 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Teams</CardTitle>
            <CardDescription>
              This contributor is part of {contributorDetails?.teams.length}{" "}
              teams
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contributorDetails?.teams && (
              <TeamCardList teamArray={contributorDetails?.teams} />
            )}
          </CardContent>
        </Card>

        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Repositories</CardTitle>
            <CardDescription>
              This contributor is part of{" "}
              {contributorDetails?.github_repositories.length} repositories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contributorDetails?.github_repositories && (
              <GithubRepoList
                githubRepos={contributorDetails?.github_repositories}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
