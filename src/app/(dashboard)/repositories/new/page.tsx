"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import BreadCrumb from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";
import { GithubRepoCard } from "@/components/githubRepoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Team } from "@prisma/client";
import { useRouter } from "next/navigation";

import { RepoSearchInput } from "@/components/repo/repoSeachInput";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Icons } from "@/components/icons";

const breadcrumbItems = [
  { title: "Repositories", link: "/repositories" },
  { title: "New", link: "/repositories/new" },
];
export default function CreateTeamPage() {
  const [githubRepos, setGithubRepos] = useState<GithubRepoDto[]>([]);
  const [canNext, setCanNext] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedRepo, setSelectedRepo] = useState<GithubRepoDto>();
  const [canPrevious, setCanPrevious] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [repositoryTeams, setRepositoryTeams] = useState<Team[]>([]);
  const [registeredRepositoryNameArray, setRegisteredRepositoryNameArray] =
    useState<string[]>([]);
  const [loadingTeamTransition, setLoadingTeamTransition] =
    useState<boolean>(false);
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [team, setTeam] = useState<Team>();

  const handleQueryGithubRepos = async (page: number = 1) => {
    setIsLoading(true);
    const { data } = await axios.get(`/api/github/repo?page=${page}`);
    if (data.success && data.gitRepos.length > 0) {
      setGithubRepos(data.gitRepos);
    }
    setIsLoading(false);
  };

  const handleQueryRegisteredSingleRepositoryTeams = async () => {
    setIsLoading(true);
    const { data } = await axios.get(`/api/repositories`);
    if (data.success && data.userTeams) {
      setRepositoryTeams(data.userTeams);
      setIsLoading(false);
    }
  };

  const handleOpenRepoDialog = async (
    repo: GithubRepoDto,
    selected?: boolean,
  ) => {
    setSelectedRepo(repo);
    setOpen(true);
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
    if (repositoryTeams.length > 0) {
      setRegisteredRepositoryNameArray(
        repositoryTeams.map((team) => team.name),
      );
    }
  }, [repositoryTeams]);

  useEffect(() => {
    handleQueryRegisteredSingleRepositoryTeams();
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
          <div className="flex items-start justify-between w-4/12">
            <RepoSearchInput
              onSelectRepo={handleOpenRepoDialog}
            ></RepoSearchInput>
          </div>
        </div>
        <Separator />
        <AlertDialog open={open}>
          {!isLoading ? (
            <div>
              <div className="grid gap-4 lg:grid-cols-2">
                {githubRepos
                  .filter(
                    (repo) =>
                      !registeredRepositoryNameArray.includes(repo.full_name),
                  )
                  .map((repo) => {
                    return (
                      <GithubRepoCard
                        githubRepoDto={repo}
                        onSelectRepo={handleOpenRepoDialog}
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
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <div className="flex">
                  <Icons.gitHub className="mr-2 h-5 w-5" />
                  {selectedRepo?.full_name.toUpperCase()}
                </div>
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action can take several minutes to complete depending on
                your repository size. Please hang tight until the new report is
                generated.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-6">
              <AlertDialogCancel
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <Button
                onClick={() => {
                  if (selectedRepo) {
                    handleSelectRepo(selectedRepo);
                  }
                }}
                disabled={loadingTeamTransition}
              >
                {loadingTeamTransition ? "Loading..." : "Continue"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
