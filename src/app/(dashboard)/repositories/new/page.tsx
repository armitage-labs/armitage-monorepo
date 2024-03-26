"use client";

import React, { useEffect, useState } from "react";
import BreadCrumb from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";
import axios from "axios";
import { GithubRepoCard } from "@/components/githubRepoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Team } from "@prisma/client";
import { useRouter } from "next/navigation";

const breadcrumbItems = [
  { title: "Repositories", link: "/repositories" },
  { title: "New", link: "/repositories/new" },
];
export default function CreateTeamPage() {
  const [githubRepos, setGithubRepos] = useState<GithubRepoDto[]>([]);
  const [canNext, setCanNext] = useState<boolean>(false);
  const [canPrevious, setCanPrevious] = useState<boolean>(false);
  const [isLoading, setIsisLoading] = useState<boolean>(true);
  const [loadingTeamTransition, setLoadingTeamTransition] =
    useState<boolean>(false);
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [team, setTeam] = useState<Team>();

  const handleQueryGithubRepos = async (page: number = 1) => {
    setIsisLoading(true);
    const { data } = await axios.get(`/api/github/repo?page=${page}`);
    if (data.success && data.gitRepos.length > 0) {
      setGithubRepos(data.gitRepos);
    }
    setIsisLoading(false);
  };

  const handleSelectRepo = async (repo: GithubRepoDto) => {
    setLoadingTeamTransition(true);
    const { data } = await axios.post(`/api/repositories`, {
      repositoryFullName: repo.full_name,
      repositoryName: repo.name,
    });
    if (data.success) {
      setTeam(data.createdTeam);
    }
  };

  const handleCreateCalculationRequest = async () => {
    if (team) {
      const { data } = await axios.get(`/api/credmanager?team_id=${team.id}`);
      if (data && data.success) {
        router.push(`/repositories/${team.id}`);
      }
    }
  };

  useEffect(() => {
    if (team) handleCreateCalculationRequest();
  }, [team]);

  useEffect(() => {
    handleQueryGithubRepos();
  }, []);

  useEffect(() => {
    setCanNext(githubRepos.length === 10);
    setCanPrevious(page > 1);
  }, [githubRepos, page]);

  useEffect(() => {
    handleQueryGithubRepos(page);
  }, [page]);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Add new repository`} description="" />
        </div>
        <Separator />
        {!isLoading ? (
          <div>
            <div className="grid gap-4 lg:grid-cols-2">
              {githubRepos.map((repo) => {
                return (
                  <GithubRepoCard
                    githubRepoDto={repo}
                    onSelectRepo={handleSelectRepo}
                    loadingTeamTransition={loadingTeamTransition}
                  ></GithubRepoCard>
                );
              })}
            </div>
            <div className="flex justify-between pt-16">
              <div>
                <Button
                  variant="default"
                  onClick={() => {
                    setPage(page - 1);
                  }}
                  disabled={!canPrevious}
                >
                  Previous Page
                </Button>
              </div>
              <div className="pl-6">
                <Button
                  variant="default"
                  onClick={() => {
                    setPage(page + 1);
                  }}
                  disabled={!canNext}
                >
                  Next Page
                </Button>
              </div>
            </div>
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
