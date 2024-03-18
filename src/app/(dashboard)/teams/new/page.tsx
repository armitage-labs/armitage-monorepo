"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import BreadCrumb from "@/components/breadcrumbs";
import { useSession } from "next-auth/react";
import { CreateTeamStepper } from "@/components/createTeamSteps";
import { CreateTeamCard } from "@/components/teams/createTeam";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Team } from "@/app/api/teams/fetchUserTeams";
import { RegisteredGitRepo } from "@/app/api/github/repo/registered/fetchRegisteredRepos";
import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";
import { Circles } from "react-loader-spinner";
import { GitRepoView, columns } from "./columns";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { TeamCalculationCreated } from "@/components/teams/teamCalculationCreated";
import { useRouter } from "next/navigation";

const breadcrumbItems = [
  { title: "Teams", link: "/teams" },
  { title: "Create", link: "/teams/create" },
];
export default function CreateTeamPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [createTeamName, setCreateTeamName] = useState<string>();
  const [currentStep, setCurrentStep] = useState(0);
  const [githubRepos, setGithubRepos] = useState<GithubRepoDto[]>([]);
  const [githubRepoColumnData, setGithubRepoColumnData] = useState<
    GitRepoView[]
  >([]);
  const [registeredGitRepos, setRegisteredGitRepos] = useState<
    RegisteredGitRepo[]
  >([]);
  const [selectedTeam, setSelectedTeam] = useState<Team>();
  const [, setCreatedCalculationRequest] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [canNext, setCanNext] = useState<boolean>(false);
  const [canPrevious, setCanPrevious] = useState<boolean>(false);
  const router = useRouter();

  const handleCreateTeam = async () => {
    setIsLoading(true);
    const { data } = await axios.post("/api/teams", { name: createTeamName });
    if (data.success) {
      setCurrentStep(1);
      setIsLoading(false);
      setSelectedTeam(data.createdTeam);
    }
  };

  const handleFetchGithubRepos = async () => {
    const { data } = await axios.get("/api/github/repo");
    if (data.success && data.gitRepos.length > 0) {
      setGithubRepos(data.gitRepos);
    }
  };

  const handleQueryGithubRepos = async (page: number) => {
    const { data } = await axios.get(`/api/github/repo?page=${page}`);
    if (data.success && data.gitRepos.length > 0) {
      setGithubRepos(data.gitRepos);
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
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    if (selectedTeam) {
      setCurrentStep(2);
      const { data } = await axios.get(
        `/api/credmanager?team_id=${selectedTeam.id}`,
      );
      if (data && data.success) {
        setCreatedCalculationRequest(true);
      }
      setIsLoading(false);
    }
  };

  function canNextPage(): boolean {
    return githubRepoColumnData.length < 10;
  }

  function canPreviousPage(): boolean {
    return page > 1;
  }

  // loads in all the repos the user has access to
  useEffect(() => {
    handleFetchGithubRepos();
  }, []);

  useEffect(() => {
    if (selectedTeam !== undefined) {
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
      handleFetchRegisteredRepos();
      setCanNext(canNextPage());
      setCanPrevious(canPreviousPage());
    }
  }, [selectedTeam, githubRepos]);

  useEffect(() => {
    handleQueryGithubRepos(page);
  }, [page]);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Create team`} description="" />
        </div>
        <Separator />

        <CreateTeamStepper currentStep={currentStep}></CreateTeamStepper>
        {isLoading ? (
          <div className="pt-36 flex justify-center">
            <Circles color="black" />
          </div>
        ) : (
          <div>
            {currentStep == 0 ? (
              <div className="pt-36 flex justify-center">
                <CreateTeamCard
                  handleCreateTeam={handleCreateTeam}
                  setCreateTeamName={setCreateTeamName}
                ></CreateTeamCard>
              </div>
            ) : currentStep === 1 ? (
              <div>
                <div>
                  <DataTable
                    columns={columns}
                    data={githubRepoColumnData}
                    page={page}
                    setPage={setPage}
                    canGoNext={canNext}
                    canGoPrevious={canPrevious}
                  ></DataTable>

                  <div className="flex justify-center">
                    <Button variant="default" onClick={handleGenerateReport}>
                      Next Step
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="pt-16 flex justify-center">
                  <TeamCalculationCreated></TeamCalculationCreated>
                </div>
                <div className="pt-16 flex justify-center">
                  <Button
                    variant="default"
                    onClick={() => {
                      router.push("/teams");
                    }}
                  >
                    Return to teams
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
