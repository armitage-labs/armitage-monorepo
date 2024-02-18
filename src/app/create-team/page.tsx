"use client";

import { Circles } from "react-loader-spinner";
import { GithubRepoDto } from "../api/github/repo/types/githubRepo.dto";
import { RegisteredGitRepo } from "../api/github/repo/registered/fetchRegisteredRepos";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserCredDto } from "../api/credmanager/route";
import { CreateTeamCard } from "@/components/teams/createTeam";

export default function GitRepo() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [createTeamName, setCreateTeamName] = useState<string>();
  const [githubRepos, setGithubRepos] = useState<GithubRepoDto[]>([]);
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

  const handleCreateTeam = async () => {
    setIsLoading(true);
    const { data } = await axios.post("/api/teams", { name: createTeamName });
    if (data.success) {
      setIsLoading(false);
    }
  };

  const handleFetchUserTeams = async () => {
    setIsLoading(true);
    const { data } = await axios.get("/api/teams");
    if (data.success) {
      setIsLoading(false);
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
    }
  }, [registeredGitRepos, githubRepos]);

  return (
    <main>
      <section className="pt-6">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 pb-6">
          <div className="flex justify-center">
            {githubRepos.length > 0 && registeredGitRepos ? (
              <div>
                {userCredDtos.length > 0 ? (
                  <div></div>
                ) : (
                  <div>
                    <div className="pt-6"></div>
                    <div className="pt-6">
                      <CreateTeamCard
                        handleCreateTeam={handleCreateTeam}
                        setCreateTeamName={setCreateTeamName}
                      ></CreateTeamCard>
                    </div>
                  </div>
                )}
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
