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

interface PageProps {
    params: { teamId: string };
}

export default function TeamSettingsPage({ params }: PageProps) {
    const [team, setTeam] = useState<Team>();
    const { data: session } = useSession();
    const teamId = params.teamId;

    const breadcrumbItems = [
        { title: "Teams", link: "/teams" },
        { title: "Team details", link: `/teams/${teamId}` },
        { title: "Team Config", link: `/teams/${teamId}/config` },
    ];

    const handleFetchTeams = async () => {
        const { data } = await axios.get("/api/teams?team_id=" + teamId);
        if (data.success) {
            setTeam(data.userTeams[0]);
        }
    };

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
                        <Heading
                            title={`${team ? team.name : ""} Configuration`}
                            description={`Manage your team configuration`}
                        />
                    )}
                </div>
                <Separator />

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4">
                        <Slider defaultValue={[50]} max={100} step={1} />
                    </div>
                    <div className="p-4">
                        <Slider defaultValue={[50]} max={100} step={1} />
                    </div>
                </div>
            </div>
        </>
    );
}
