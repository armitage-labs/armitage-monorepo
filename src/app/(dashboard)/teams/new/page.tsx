"use client";
import BreadCrumb from "@/components/breadcrumbs";
import { CreateTeamCard } from "@/components/teams/createTeam";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Circles } from "react-loader-spinner";

const breadcrumbItems = [
  { title: "Teams", link: "/teams" },
  { title: "Create", link: "/teams/create" },
];
export default function CreateTeamPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [createTeamName, setCreateTeamName] = useState<string>();
  const router = useRouter();

  const handleCreateTeam = async () => {
    setIsLoading(true);
    const { data } = await axios.post("/api/teams", { name: createTeamName });
    if (data.success) {
      router.push("/teams");
    }
  };

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Create team`} description="" />
        </div>
        <Separator />
        {isLoading ? (
          <div className="pt-36 flex justify-center">
            <Circles color="black" />
          </div>
        ) : (
          <div>
            <div className="pt-36 flex justify-center">
              <CreateTeamCard
                handleCreateTeam={handleCreateTeam}
                setCreateTeamName={setCreateTeamName}
              ></CreateTeamCard>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
