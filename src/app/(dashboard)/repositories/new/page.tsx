
"use client";

import React, { useEffect, useState } from "react";
import BreadCrumb from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";
import axios from "axios";
import { GithubRepoCard } from "@/components/githubRepoCard";

const breadcrumbItems = [
  { title: "Repositories", link: "/repositories" },
  { title: "New", link: "/repositories/new" },
];
export default function CreateTeamPage() {
  const [githubRepos, setGithubRepos] = useState<GithubRepoDto[]>([]);

  const handleQueryGithubRepos = async (page: number = 1) => {
    const { data } = await axios.get(`/api/github/repo?page=${page}`);
    if (data.success && data.gitRepos.length > 0) {
      setGithubRepos(data.gitRepos);
    }
  };

  useEffect(() => {
    handleQueryGithubRepos();
  }, []);


  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Add new repository`} description="" />
        </div>
        <Separator />
        {githubRepos.length !== 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            {githubRepos.map((repo) => {
              return (
                <GithubRepoCard githubRepoDto={repo}></GithubRepoCard>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
