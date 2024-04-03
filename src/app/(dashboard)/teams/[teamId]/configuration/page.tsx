"use client";

import axios from "axios";
import BreadCrumb from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import { Team } from "@prisma/client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { WeightConfig } from "@/app/api/configuration/weightConfig.dto";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import WeightSlider from "@/components/weightSlider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icons } from "@/components/icons";

interface PageProps {
  params: { teamId: string };
}

export default function TeamConfigurationPage({ params }: PageProps) {
  const [team, setTeam] = useState<Team>();
  const [weightConfig, setWeightConfig] = useState<WeightConfig>();
  const { data: session } = useSession();
  const teamId = params.teamId;
  const breadcrumbItems = [
    { title: "Teams", link: "/teams" },
    { title: "Team details", link: `/teams/${teamId}` },
    { title: "Team Config", link: `/teams/${teamId}/config` },
  ];

  const router = useRouter();

  const handleFetchTeams = async () => {
    const { data } = await axios.get("/api/teams?team_id=" + teamId);
    if (data.success) {
      setTeam(data.userTeams[0]);
    }
  };

  const handleFetchTeamConfig = async () => {
    const { data } = await axios.get("/api/configuration?team_id=" + teamId);
    if (data.success) {
      setWeightConfig(data.weights);
    }
  };

  const onChange = async (value: number, key: string) => {
    let newWeightConfig: WeightConfig;
    if (weightConfig) {
      newWeightConfig = weightConfig;
    } else {
      newWeightConfig = {};
    }
    newWeightConfig[key].value = value;
    setWeightConfig(newWeightConfig);
  };

  const handleSaveConfig = async () => {
    const { data } = await axios.post(
      `/api/configuration?team_id=${teamId}`,
      weightConfig,
    );
    if (data.success) {
      handleCalculate();
    }
  };

  const handleCalculate = async () => {
    const { data } = await axios.get(`/api/credmanager?team_id=${team!.id}`);
    if (data && data.success) {
      if (team?.single_repository) {
        router.push(`/repositories/${teamId}`);
      } else {
        router.push(`/teams/${teamId}`);
      }
    }
  };

  useEffect(() => {
    if (team) {
      handleFetchTeamConfig();
    }
  }, [team]);

  useEffect(() => {
    if (session?.userId) {
      handleFetchTeams();
    }
  }, [session]);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          {team == null ? (
            <Skeleton className="h-10 w-[520px]" />
          ) : (
            <>
              <Heading
                title={`${team ? team.name : ""} Configuration`}
                description={`Manage your team configuration`}
              />

              <div>
                <Button
                  onClick={() => {
                    handleSaveConfig();
                  }}
                >
                  Save
                </Button>
              </div>
            </>
          )}
        </div>
        <Separator />
        <div className="pt-6 leading-7 [&:not(:first-child)]:mt-6">
          <Alert>
            <Icons.settings className="mr-2 h-4 w-4" />
            <AlertTitle>Customize your team impact</AlertTitle>
            <AlertDescription>
              Impactful contributions by adjusting sliders to align with your
              preferences. These values are quasi-exponential and nodes on the
              graph will be weighted accordingly.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {weightConfig == null ? (
            <Skeleton className="h-10 w-[520px]" />
          ) : (
            <>
              {Object.keys(weightConfig).map((key) => (
                <div className="p-4">
                  <WeightSlider
                    weightName={key}
                    weight={weightConfig[key]}
                    onChange={onChange}
                  ></WeightSlider>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
