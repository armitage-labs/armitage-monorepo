"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";
import { RegisteredGitRepo } from "@/app/api/github/repo/registered/fetchRegisteredRepos";

export default function GitRepo() {
  const { data: session } = useSession();
  const [githubRepos, setGithubRepos] = useState<GithubRepoDto[]>([]);
  const [registeredGitRepos, setRegisteredGitRepos] = useState<
    RegisteredGitRepo[]
  >([]);

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

  return (
    <main>
      <section className="pt-6"></section>
    </main>
  );
}
