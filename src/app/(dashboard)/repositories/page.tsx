"use client";

import BreadCrumb from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GithubRepoCard } from "@/components/githubRepoCard";
import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";

const breadcrumbItems = [{ title: "Repositories", link: "/dashboard/repositories" }];

export default function TeamsPage() {
  const [githubRepos, setGithubRepos] = useState<GithubRepoDto[]>([]);
  const router = useRouter();

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
          <Heading
            title={`Repositories`}
            description={`Manage your repositories or create a new one`}
          />
          <Button
            className="text-xs md:text-sm"
            onClick={() => router.push(`/repositories/new`)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <Separator />
        {githubRepos.length !== 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            <GithubRepoCard githubRepoDto={githubRepos[0]}></GithubRepoCard>
            <GithubRepoCard githubRepoDto={githubRepos[1]}></GithubRepoCard>
          </div>
        )}

      </div>
    </>
  );
}
