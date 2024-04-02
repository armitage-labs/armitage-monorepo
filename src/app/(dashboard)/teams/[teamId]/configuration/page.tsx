"use client";

import axios from "axios";
import BreadCrumb from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Skeleton } from "@/components/ui/skeleton";
import { Team } from "@prisma/client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { WeightConfig } from "@/app/api/configuration/weightConfig.dto";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PageProps {
  params: { teamId: string };
}

export default function TeamSettingsPage({ params }: PageProps) {
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

  const onChange = async (value: number[], key: string) => {
    let newWeightConfig: WeightConfig;
    if (weightConfig) {
      newWeightConfig = weightConfig;
    } else {
      newWeightConfig = {};
    }
    newWeightConfig[key].value = value[0];
    setWeightConfig(newWeightConfig);
  };

  const handleSaveConfig = async () => {
    const { data } = await axios.post(
      `/api/configuration?team_id=${teamId}`,
      weightConfig,
    );
    if (data.success) {
      router.push(`/teams/${teamId}`);
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

        <div className="grid grid-cols-2 gap-4">
          {weightConfig == null ? (
            <Skeleton className="h-10 w-[520px]" />
          ) : (
            <>
              {Object.keys(weightConfig).map((key) => (
                <div className="p-4">
                  <h4 className="text-xl font-semibold tracking-tight pb-3">
                    {weightConfig[key].lable}
                  </h4>
                  <Slider
                    defaultValue={[weightConfig[key].value]}
                    max={weightConfig[key].max}
                    min={weightConfig[key].min}
                    step={weightConfig[key].step}
                    onValueChange={(event) => onChange(event, key)}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
