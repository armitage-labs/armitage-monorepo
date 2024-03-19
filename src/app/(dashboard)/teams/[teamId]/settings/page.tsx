"use client";

import BreadCrumb from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import TeamGithubRepositoriesTable from "@/components/teams/teamGithubRepositoriesTable";

interface PageProps {
  params: { teamId: string };
}

export default function TeamSettingsPage({ params }: PageProps) {
  const teamId = params.teamId;
  const breadcrumbItems = [
    { title: "Teams", link: "/teams" },
    { title: "Team details", link: `/teams/${teamId}` },
    { title: "Team settings", link: `/teams/${teamId}/settings` },
  ];

  const router = useRouter();

  const handleSave = async () => {
    const { data } = await axios.get(`/api/credmanager?team_id=${teamId}`);
    if (data && data.success) {
      router.push(`/overview`);
    }
  };

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Team settings`}
            description={`Manage your repositories`}
          />
        </div>
        <Separator />

        <div className="pt-6">
          <TeamGithubRepositoriesTable
            teamId={teamId}
          ></TeamGithubRepositoriesTable>
        </div>

        <div className="pt-6 flex justify-center items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button> Save </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  This will recalculate your scores
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You can always return your team to the previous state by
                  selecting the same repositories you had before. After saving,
                  this team will get calculated and become unavailable for a few
                  minutes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSave}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}
