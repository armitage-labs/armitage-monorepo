"use client";

import { DataTable } from "./data-table";
import { GitRepoView, columns } from "./columns";
import { GenerateCalculations } from "@/components/generateCalculationsDrawer";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { CalculationResult } from "./calculationResults";
import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";
import { RegisteredGitRepo } from "@/app/api/github/repo/registered/fetchRegisteredRepos";
import { UserCredDto } from "@/app/api/credmanager/route";
import { LoadingCircle } from "@/components/navigation/loading";

export default function GitRepo() {
  const { data: session } = useSession();
  const [githubRepos, setGithubRepos] = useState<GithubRepoDto[]>([]);
  const [githubRepoColumnData, setGithubRepoColumnData] = useState<
    GitRepoView[]
  >([]);
  const [registeredGitRepos, setRegisteredGitRepos] = useState<
    RegisteredGitRepo[]
  >([]);
  const [userCredDtos, setUserCredDtos] = useState<UserCredDto[]>([]);

  const handleFetchGithubRepos = async () => {
    const { data } = await axios.get("/api/github/repo");
    if (data.success) {
      setGithubRepos(data.gitRepos);
    }
  };

  const handleFetchRegisteredRepos = async () => {
    const { data } = await axios.get("/api/github/repo/registered");
    if (data.success) {
      setRegisteredGitRepos(data.registeredRepos);
    }
  };

  useEffect(() => {
    if (
      session?.accessToken &&
      session.githubLogin &&
      session.userId &&
      githubRepos.length < 1
    ) {
      handleFetchGithubRepos();
      handleFetchRegisteredRepos();
    }
  }, [session]);

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
        initially_registered: registeredGitRepos.some(
          (registeredRepo) =>
            registeredRepo.full_name === githubRepoDto.full_name,
        ),
      }));
      setGithubRepoColumnData(columnData);
    }
  }, [registeredGitRepos, githubRepos]);

  return (
    <main>
      <section className="pt-6">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 pb-6">
          <div>
            <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
              <li className="flex items-center text-blue-600 dark:text-blue-500 space-x-2.5 rtl:space-x-reverse">
                <span className="flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                  1
                </span>
                <span>
                  <h3 className="font-medium leading-tight">
                    Choose Repositories
                  </h3>
                  <p className="text-sm">Click on checkbox to register</p>
                </span>
              </li>
              <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                  2
                </span>
                <span>
                  <h3 className="font-medium leading-tight">
                    Calculate contributions
                  </h3>
                  <p className="text-sm">
                    Confirm your preferences and click `generate`
                  </p>
                </span>
              </li>
              <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                  3
                </span>
                <span>
                  <h3 className="font-medium leading-tight">Analyze results</h3>
                  <p className="text-sm"></p>
                </span>
              </li>
            </ol>
          </div>
          <div className="flex justify-center">
            {githubRepos.length > 0 && registeredGitRepos ? (
              <div>
                {userCredDtos.length > 0 ? (
                  <CalculationResult
                    userCredDtoList={userCredDtos}
                  ></CalculationResult>
                ) : (
                  <div>
                    <div className="pt-6">
                      <DataTable
                        columns={columns}
                        data={githubRepoColumnData}
                      ></DataTable>
                      <GenerateCalculations
                        teamId=""
                        handleCalculationResult={setUserCredDtos}
                        registeredGitRepos={registeredGitRepos}
                        refreshRegistered={handleFetchRegisteredRepos}
                      ></GenerateCalculations>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-36 flex justify-center">
                <LoadingCircle></LoadingCircle>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
