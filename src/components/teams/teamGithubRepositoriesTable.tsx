"use client";

import { RegisteredGitRepo } from "@/app/api/github/repo/registered/fetchRegisteredRepos";
import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";
import axios from "axios";
import { useEffect, useState } from "react";
import { GitRepoView, columns } from "./columns";
import { DataTable } from "./data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";

interface TeamGithubRepositoriesTableProps {
  teamId: string;
}

export default function TeamGithubRepositoriesTable({
  teamId,
}: TeamGithubRepositoriesTableProps) {
  const [registeredGitRepos, setRegisteredGitRepos] = useState<
    RegisteredGitRepo[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>();
  const [foundAddRepo, setFoundAddRepo] = useState<GithubRepoDto>();
  const [canNext, setCanNext] = useState<boolean>(false);
  const [canPrevious, setCanPrevious] = useState<boolean>(false);
  const [githubRepos, setGithubRepos] = useState<GithubRepoDto[]>([]);
  const [githubRepoColumnData, setGithubRepoColumnData] = useState<
    GitRepoView[]
  >([]);

  const handleQueryGithubRepos = async (page: number = 1) => {
    const { data } = await axios.get(`/api/github/repo?page=${page}`);
    if (data.success && data.gitRepos.length > 0) {
      setGithubRepos(data.gitRepos);
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

  const handleSearchRepo = async () => {
    const { data } = await axios.get(`/api/search/repo?name=${search}`);
    console.log(data?.results?.length);
    if (data?.results?.length == 1) {
      setFoundAddRepo(data?.results[0]);
    } else {
      setFoundAddRepo(undefined);
    }
  };

  const handleRegisterRepo = async (name: string, fullName: string) => {
    await axios.post(`/api/github/repo`, {
      name: name,
      full_name: fullName,
      team_id: teamId,
    });
    setSearch("");
    handleFetchRegisteredRepos();
  };

  const handleUnregisterRepo = async (fullName: string) => {
    await axios.delete(
      `/api/github/repo?full_name=${fullName}&team_id=${teamId}`,
    );
    handleFetchRegisteredRepos();
  };

  useEffect(() => {
    setCanNext(githubRepoColumnData.length === 10);
    setCanPrevious(page > 1);
  }, [githubRepoColumnData, page]);

  useEffect(() => {
    handleQueryGithubRepos(page);
  }, []);

  useEffect(() => {
    handleSearchRepo();
  }, [search]);

  useEffect(() => {
    if (githubRepos.length > 0) {
      const columnData = githubRepos.map((githubRepoDto) => ({
        id: githubRepoDto.id,
        name: githubRepoDto.name,
        full_name: githubRepoDto.full_name,
        stars: githubRepoDto.stargazers_count,
        owner: githubRepoDto.owner.login,
        forks: githubRepoDto.forks_count,
        created_at: githubRepoDto.created_at,
        html_url: githubRepoDto.html_url,
        team_id: teamId,
        initially_registered: registeredGitRepos.some(
          (registeredRepo) =>
            registeredRepo.full_name === githubRepoDto.full_name,
        ),
      }));
      setGithubRepoColumnData(columnData);
      handleFetchRegisteredRepos();
    }
  }, [githubRepos]);

  useEffect(() => {
    handleQueryGithubRepos(page);
  }, [page]);

  return (
    <>
      <div>
        <div className="flex items-center py-2">
          <Input
            placeholder="Search e.g owner/name ... "
            onChange={(event) => setSearch(event.target.value)}
            value={search}
            className="max-w-sm"
          />
          <Button
            className="items-center ml-4"
            disabled={foundAddRepo == null}
            onClick={() => {
              if (foundAddRepo != null) {
                handleRegisterRepo(foundAddRepo?.name, foundAddRepo?.full_name);
              }
            }}
          >
            {foundAddRepo != null ? <>Add Repo</> : <>Repo Not Found</>}
          </Button>
        </div>
        <div className="flex items-center py-2">
          {registeredGitRepos.map((registeredGitRepo) => (
            <Badge
              className="mr-2 p-2 primary-badge-outline"
              variant={"outline"}
            >
              <Icons.gitHub className="mr-2 ml-2 h-4 w-4" />
              <span>{registeredGitRepo.full_name}</span>
              <Icons.close
                className="mr-2 ml-2 h-4 w-4 cursor-pointer"
                onClick={() =>
                  handleUnregisterRepo(registeredGitRepo.full_name)
                }
              />
            </Badge>
          ))}
        </div>
        <DataTable
          columns={columns}
          data={githubRepoColumnData}
          page={page}
          setPage={setPage}
          canGoNext={canNext}
          canGoPrevious={canPrevious}
        ></DataTable>
      </div>
    </>
  );
}
