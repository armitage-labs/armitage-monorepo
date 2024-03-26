import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { BookUpIcon } from "lucide-react";
import { Icons } from "./icons";
import { Team } from "@prisma/client";
import { useRouter } from "next/navigation";

interface GithubRepoCardProps {
  teamDto: Team;
}

export function RepositoryTeamCard({ teamDto }: GithubRepoCardProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0 h-3/4">
        <div className="space-y-1">
          <CardTitle>
            <div className="flex">
              {teamDto.name}
              <Icons.gitHub className="ml-3 h-5 w-5" />
            </div>
          </CardTitle>
          <CardDescription className="pt-1 flex justify-between h-full"></CardDescription>
        </div>
        <div className="flex items-center rounded-md bg-secondary text-secondary-foreground">
          <Button
            variant="secondary"
            className="shadow-none"
            onClick={() => {
              router.push(`/repositories/${teamDto.id}`);
            }}
          >
            <BookUpIcon className="mr-2 h-4 w-4" />
            Select
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center"></div>
          <div className="flex items-center">
            <Icons.folderGit className="mr-1 h-5 w-5" />
          </div>
          <div>
            {" "}
            Last updated on{" "}
            {new Date(teamDto.created_at).toLocaleString([], {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
