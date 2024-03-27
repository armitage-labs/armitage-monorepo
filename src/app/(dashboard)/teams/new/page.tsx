"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import BreadCrumb from "@/components/breadcrumbs";
import { CreateTeamStepper } from "@/components/createTeamSteps";
import { CreateTeamCard } from "@/components/teams/createTeam";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Team } from "@/app/api/teams/fetchUserTeams";
import { LoadingCircle } from "@/components/navigation/loading";
import { Button } from "@/components/ui/button";
import { TeamCalculationCreated } from "@/components/teams/teamCalculationCreated";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import TeamGithubRepositoriesTable from "@/components/teams/teamGithubRepositoriesTable";

const breadcrumbItems = [
  { title: "Teams", link: "/teams" },
  { title: "Create", link: "/teams/create" },
];
export default function CreateTeamPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [createTeamName, setCreateTeamName] = useState<string>();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState<Team>();
  const [, setCreatedCalculationRequest] = useState<boolean>(false);
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

  const handleGenerateReport = async () => {
    if (selectedTeam) {
      setIsLoading(true);
      const { data } = await axios.get(
        `/api/github/repo/registered?team_id=${selectedTeam.id}`,
      );
      if (data.success && data.registeredRepos.length == 0) {
        setIsLoading(false);
        toast("Failed to start calculation", {
          description: "Please select at least one repository to continue",
        });
      } else {
        setCurrentStep(2);
        const { data } = await axios.get(
          `/api/credmanager?team_id=${selectedTeam.id}`,
        );
        if (data && data.success) {
          setCreatedCalculationRequest(true);
        }
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (currentStep === 2) {
      redirect(`/teams/${selectedTeam?.id}`);
    }
  }, [
    currentStep
  ]);

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
            <LoadingCircle></LoadingCircle>
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
                <div className="pt-6">
                  <TeamGithubRepositoriesTable
                    teamId={selectedTeam!.id}
                  ></TeamGithubRepositoriesTable>

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
