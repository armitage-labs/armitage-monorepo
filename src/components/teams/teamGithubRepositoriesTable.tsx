"use client";

import { RegisteredGitRepo } from "@/app/api/github/repo/registered/fetchRegisteredRepos";
import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";
import axios from "axios";
import { useEffect, useState } from "react";
import { GitRepoView, columns } from "./columns";
import { DataTable } from "./data-table";

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
