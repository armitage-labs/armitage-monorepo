import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { BookUpIcon } from "lucide-react";
import { Icons } from "../icons";
import { Team } from "@prisma/client";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  teamDto: Team;
}

export function ProjectCard({ teamDto }: ProjectCardProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0 h-3/4">
        <div className="space-y-1">
          <CardTitle>
            <div className="flex">
              <Icons.gitHub className="ml-3 h-6 w-6 mr-6" />
              {teamDto.name}
            </div>
          </CardTitle>
          <CardDescription className="pt-1 flex justify-between h-full"></CardDescription>
        </div>
        <div className="flex items-center rounded-md bg-secondary text-secondary-foreground">
          <Button
            variant="secondary"
            className="shadow-none"
            onClick={() => {
              router.push(`/projects/${teamDto.id}`);
            }}
          >
            <BookUpIcon className="mr-2 h-4 w-4" />
            Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center"></div>
          <div className="flex">
            <Icons.calendarClock className="mr-1 h-5 w-5" />
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
          <div className="flex items-center">
            {teamDto.single_repository ? (
              <>
                <Icons.folderRoot className="ml-2 h-5 w-5" />
                <p className="pl-3 pr-3"> {"Single repository project"}</p>
              </>
            ) : (
              <>
                <Icons.folderTree className="ml-2 h-5 w-5" />
                <p className="pl-3"> {"Multi repository project"}</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
