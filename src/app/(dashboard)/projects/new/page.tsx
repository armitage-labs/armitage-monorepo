"use client";

import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";
import BreadCrumb from "@/components/breadcrumbs";
import ProjectTeamNameForm from "@/components/projects/projectRepoNameForm";
import ProjectRepoSelect from "@/components/projects/projectRepoSelect";
import { TeamCalculationCreated } from "@/components/teams/teamCalculationCreated";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@radix-ui/react-separator";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const breadcrumbItems = [
  { title: "Projects", link: "/projects" },
  { title: "New", link: "/projects/new" },
];

export default function CreateNewProjectPage() {
  const [createTeamName, setCreateTeamName] = useState<string>("");
  const [selectedGithubRepos, setSelectedGithubRepos] = useState<
    GithubRepoDto[]
  >([]);
  const [currentStep, setCurrentStep] = useState(0);

  const handleOnRepoSelect = async (
    repo: GithubRepoDto,
    selected?: boolean,
  ) => {
    if (selected) {
      const foundObject = selectedGithubRepos.find(
        (item) => item.id === repo.id,
      );
      if (foundObject == null) {
        setSelectedGithubRepos([...selectedGithubRepos, repo]);
      }
    } else {
      setSelectedGithubRepos(removeRepoById(selectedGithubRepos, repo.id));
    }
  };

  const removeRepoById = (
    repos: GithubRepoDto[],
    repoIdToRemove: string,
  ): GithubRepoDto[] => {
    return repos.filter((repo) => repo.id !== repoIdToRemove);
  };

  const handleCreateTeam = async () => {
    nextStep();
    const { data } = await axios.post("/api/teams", { name: createTeamName });
    if (data.success) {
      await handleRegisterRepos(data.createdTeam.id);
      handleGenerateReport(data.createdTeam.id);
    } else {
      privouseStep();
    }
  };

  const handleRegisterRepos = async (projectId: string) => {
    await axios.post(`/api/projects/repo`, {
      projectId: projectId,
      repos: selectedGithubRepos.map((obj) => ({
        name: obj.name,
        full_name: obj.full_name,
      })),
    });
  };

  const handleGenerateReport = async (projectId: string) => {
    const { data } = await axios.get(
      `/api/github/repo/registered?team_id=${projectId}`,
    );
    if (data.success && data.registeredRepos.length == 0) {
      toast("Failed to start calculation", {
        description: "Please select at least one repository to continue",
      });
      privouseStep();
    } else {
      const { data } = await axios.get(`/api/credmanager?team_id=${projectId}`);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const privouseStep = () => {
    setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    console.log(selectedGithubRepos);
  }, [selectedGithubRepos]);

  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        {currentStep === 0 ? (
          <Heading title={`Add repositories`} description="" />
        ) : currentStep === 1 ? (
          <Heading title={`Enter project name`} description="" />
        ) : (
          <Heading title={`Calculating`} description="" />
        )}
        <div className="flex items-start">
          {currentStep == 1 ? (
            <Button className="items-center ml-4" onClick={privouseStep}>
              Privouse step
            </Button>
          ) : currentStep === 0 ? (
            <Button
              className="items-center ml-4"
              onClick={nextStep}
              disabled={selectedGithubRepos.length == 0}
            >
              Next Step
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <Separator />

      {currentStep === 0 ? (
        <ProjectRepoSelect
          onSelectRepo={handleOnRepoSelect}
          selectedGithubRepos={selectedGithubRepos}
        ></ProjectRepoSelect>
      ) : currentStep === 1 ? (
        <ProjectTeamNameForm
          createTeamName={createTeamName}
          handleCreateTeam={handleCreateTeam}
          setCreateTeamName={setCreateTeamName}
          selectedGithubRepos={selectedGithubRepos}
          onSelectRepo={handleOnRepoSelect}
        ></ProjectTeamNameForm>
      ) : (
        <TeamCalculationCreated></TeamCalculationCreated>
      )}
    </div>
  );
}
