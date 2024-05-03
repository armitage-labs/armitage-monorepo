"use client";

import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";
import BreadCrumb from "@/components/breadcrumbs";
import { GithubRepoCard } from "@/components/githubRepoCard";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import { useEffect, useState } from "react";

const breadcrumbItems = [
  { title: "Projects", link: "/projects" },
  { title: "New", link: "/projects/new" },
];

export default function CreateNewProjectPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [githubRepos, setGithubRepos] = useState<GithubRepoDto[]>([]);
  const [selectedGithubRepos, setSelectedGithubRepos] = useState<
    GithubRepoDto[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [canPrevious, setCanPrevious] = useState<boolean>(false);
  const [canNext, setCanNext] = useState<boolean>(false);
  const [registeredRepositoryNameArray, setRegisteredRepositoryNameArray] =
    useState<string[]>([]);

  const handleOnRepoSelect = async (repo: GithubRepoDto, selected: boolean) => {
    if (selected) {
      selectedGithubRepos.push(repo);
      setSelectedGithubRepos(selectedGithubRepos);
    } else {
      setSelectedGithubRepos(
        selectedGithubRepos.filter((repo) => repo.full_name !== repo.full_name),
      );
    }
  };

  const handleQueryGithubRepos = async (page: number = 1) => {
    setIsLoading(true);
    const { data } = await axios.get(`/api/github/repo?page=${page}`);
    if (data.success && data.gitRepos.length > 0) {
      setGithubRepos(data.gitRepos);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setCanNext(githubRepos.length === 10);
    setCanPrevious(page > 1);
  }, [githubRepos, page]);

  useEffect(() => {
    handleQueryGithubRepos();
  }, []);

  useEffect(() => {
    handleQueryGithubRepos(page);
  }, [page]);

  useEffect(() => {
    console.log(selectedGithubRepos);
  }, [selectedGithubRepos]);

  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading title={`Add repositories`} description="" />
        <div className="flex items-start justify-between w-4/12">
          {/* <RepoSearchInput
                            onSelectRepo={handleOpenRepoDialog}
                        ></RepoSearchInput> */}
        </div>
      </div>
      <Separator />

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
                    onSelectRepo={handleOnRepoSelect}
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
  );
}
