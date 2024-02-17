"use client";

import { Circles } from "react-loader-spinner";
import { GithubRepoDto } from "../api/github/repo/types/githubRepo.dto";
import { RegisteredGitRepo } from "../api/github/repo/registered/fetchRegisteredRepos";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { SelectTeamDropdown } from "@/components/selectTeamDropdown";
import { Team } from "../api/teams/fetchUserTeams";
import { GitRepoView, columns } from "./columns";
import { DataTable } from "./data-table";
import { GenerateCalculations } from "@/components/generateCalculationsDrawer";
import { UserCredDto } from "../api/credmanager/route";
import { CalculationResult } from "../gitrepo/calculationResults";

export default function GitRepo() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team>();
  const [loadedData, setLoadedData] = useState<boolean>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [userCredDtos, setUserCredDtos] = useState<UserCredDto[]>([]);
  const [githubRepos, setGithubRepos] = useState<GithubRepoDto[]>([]);
  const [githubRepoColumnData, setGithubRepoColumnData] = useState<
    GitRepoView[]
  >([]);
  const [registeredGitRepos, setRegisteredGitRepos] = useState<
    RegisteredGitRepo[]
  >([]);

  const handleFetchGithubRepos = async () => {
    const { data } = await axios.get("/api/github/repo");
    if (data.success) {
      setGithubRepos(data.gitRepos);
    }
  };

  const handleFetchUserTeams = async () => {
    const { data } = await axios.get("/api/teams");
    if (data.success) {
      setTeams(data.userTeams);
    }
  };

  const handleFetchRegisteredRepos = async () => {
    if (selectedTeam) {
      const { data } = await axios.get(
        `/api/github/repo/registered?team_id=${selectedTeam.id}`,
      );
      if (data.success) {
        setRegisteredGitRepos(data.registeredRepos);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (
      session?.accessToken &&
      session.githubLogin &&
      session.userId &&
      teams.length < 1
    ) {
      handleFetchUserTeams();
      handleFetchGithubRepos();
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    setIsLoading(true);
    if (selectedTeam !== undefined) {
      handleFetchRegisteredRepos();
    }
  }, [selectedTeam]);

  useEffect(() => {
    if (githubRepos.length > 0 && selectedTeam) {
      const columnData = githubRepos.map((githubRepoDto) => ({
        id: githubRepoDto.id,
        name: githubRepoDto.name,
        full_name: githubRepoDto.full_name,
        stars: githubRepoDto.stargazers_count,
        owner: githubRepoDto.owner.login,
        forks: githubRepoDto.forks_count,
        created_at: githubRepoDto.created_at,
        html_url: githubRepoDto.html_url,
        team_id: selectedTeam.id,
        initially_registered: registeredGitRepos.some(
          (registeredRepo) =>
            registeredRepo.full_name === githubRepoDto.full_name,
        ),
      }));
      setGithubRepoColumnData(columnData);
      setLoadedData(true);
    }
  }, [registeredGitRepos, githubRepos, selectedTeam]);

  return (
    <main>
      <section className="pt-6">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 pb-6">
          <div className="flex justify-center">
            {teams.length > 0 ? (
              <div>
                <div>
                  <div className="pt-6"></div>
                  <div className="pt-6"></div>
                  {isLoading ? (
                    <div className="pt-36 flex justify-center">
                      <Circles />
                    </div>
                  ) : (
                    <div>
                      {loadedData ? (
                        <div>
                          {userCredDtos.length > 0 ? (
                            <div>
                              <CalculationResult
                                userCredDtoList={userCredDtos}
                              ></CalculationResult>
                            </div>
                          ) : (
                            <div>
                              <DataTable
                                columns={columns}
                                data={githubRepoColumnData}
                              ></DataTable>
                              <GenerateCalculations
                                teamId={selectedTeam?.id}
                                handleCalculationResult={setUserCredDtos}
                                registeredGitRepos={registeredGitRepos}
                                refreshRegistered={handleFetchRegisteredRepos}
                              ></GenerateCalculations>
                            </div>
                          )}
                        </div>
                      ) : (
                        <SelectTeamDropdown
                          teams={teams}
                          handleSelectTeam={setSelectedTeam}
                        ></SelectTeamDropdown>
                      )}
                    </div>
                  )}
                  <div className="pt-6"></div>
                </div>
              </div>
            ) : (
              <div className="pt-36 flex justify-center">
                <Circles />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
