import { useEffect, useState } from "react";
import { GithubRepoCard } from "../githubRepoCard";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";
import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";
import { ProjectRepoSearchInput } from "../repo/projectRepoSearchInput";
import ProjectGithubRepositoriesBadge from "../repo/projectGithubRepositoriesBadge";

interface ProjectRepoSelectProps {
  onSelectRepo: (repo: GithubRepoDto, selected?: boolean) => void;
  selectedGithubRepos: GithubRepoDto[];
}

export default function ProjectRepoSelect({
  onSelectRepo,
  selectedGithubRepos,
}: ProjectRepoSelectProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [canPrevious, setCanPrevious] = useState<boolean>(false);
  const [canNext, setCanNext] = useState<boolean>(false);
  const [registeredRepositoryNameArray, setRegisteredRepositoryNameArray] =
    useState<string[]>([]);
  const [githubRepos, setGithubRepos] = useState<GithubRepoDto[]>([]);

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
  return (
    <>
      {!isLoading ? (
        <div>
          <div className="flex items-start pb-4 flex-wrap">
            <div className="flex items-start justify-between pr-2 pb-2">
              <ProjectRepoSearchInput
                onSelectRepo={onSelectRepo}
              ></ProjectRepoSearchInput>
            </div>

            {selectedGithubRepos.map((registeredGitRepo) => (
              <ProjectGithubRepositoriesBadge
                githubRepoDto={registeredGitRepo}
                handleUnregisterRepo={onSelectRepo}
              ></ProjectGithubRepositoriesBadge>
            ))}
          </div>
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
                    onSelectRepo={onSelectRepo}
                    selected={selectedGithubRepos.includes(repo)}
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
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[165px] w-full rounded-xl" />
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[165px] w-full rounded-xl" />
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[165px] w-full rounded-xl" />
          </div>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[165px] w-full rounded-xl" />
          </div>
        </div>
      )}
    </>
  );
}
