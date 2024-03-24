"use client";

import { RegisteredGitRepo } from "@/app/api/github/repo/registered/fetchRegisteredRepos";
import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";
import axios from "axios";
import { useEffect, useState } from "react";
import { GitRepoView, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TeamGithubRepositoriesBadge from "./teamGithubRepositoriesBadge";
import TeamGithubRepositoriesSearch from "./teamGithubRepositoriesSearch";

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

  // const handleRegisterRepo = async (name: string, fullName: string) => {
  //   await axios.post(`/api/github/repo`, {
  //     name: name,
  //     full_name: fullName,
  //     team_id: teamId,
  //   });
  //   setSearch("");
  //   handleFetchRegisteredRepos();
  // };

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
          <TeamGithubRepositoriesSearch
            teamId={teamId}
            foundAddRepo={foundAddRepo}
            setFoundAddRepo={setFoundAddRepo}
            handleFetchRegisteredRepos={handleFetchRegisteredRepos}
          ></TeamGithubRepositoriesSearch>

          {/* <Input
            placeholder="Search with owner/name ... "
            onChange={(event) => setSearch(event.target.value)}
            value={search}
            className="max-w-sm"
          />
          <Button
            className="items-center ml-4"
            disabled={foundAddRepo == null || searchLoading}
            onClick={() => {
              if (foundAddRepo != null) {
                handleRegisterRepo(foundAddRepo?.name, foundAddRepo?.full_name);
              }
            }}
          >
            {searchLoading ? (
              <>Loading...</>
            ) : (
              <div>
                {foundAddRepo != null ? <>Add Repo</> : <>Not valid repo</>}
              </div>
            )}
          </Button> */}
        </div>
        <div className="flex items-center py-2 mb-2">
          {registeredGitRepos.map((registeredGitRepo) => (
            <TeamGithubRepositoriesBadge
              repoFullName={registeredGitRepo.full_name}
              handleUnregisterRepo={handleUnregisterRepo}
            ></TeamGithubRepositoriesBadge>
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
