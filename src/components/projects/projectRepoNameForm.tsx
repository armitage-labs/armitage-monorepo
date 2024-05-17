import { Label } from "@radix-ui/react-label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";
import ProjectGithubRepositoriesBadge from "../repo/projectGithubRepositoriesBadge";
import { useEffect } from "react";

interface ProjectTeamNameFormProps {
  createTeamName: string;
  handleCreateTeam: () => void;
  setCreateTeamName: (teamName: string) => void;
  selectedGithubRepos: GithubRepoDto[];
  onSelectRepo: (repo: GithubRepoDto, selected?: boolean) => void;
}

export default function ProjectTeamNameForm({
  createTeamName,
  handleCreateTeam,
  setCreateTeamName,
  selectedGithubRepos,
  onSelectRepo,
}: ProjectTeamNameFormProps) {
  useEffect(() => {
    if (selectedGithubRepos.length == 1) {
      setCreateTeamName(selectedGithubRepos[0].full_name);
    }
  }, []);
  return (
    <>
      <div className="pt-36">
        <div className="flex justify-center flex-wrap">
          {selectedGithubRepos.map((registeredGitRepo) => (
            <div className="pb-2">
              <ProjectGithubRepositoriesBadge
                githubRepoDto={registeredGitRepo}
                handleUnregisterRepo={onSelectRepo}
                closeable={false}
              ></ProjectGithubRepositoriesBadge>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-center">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Create new project</CardTitle>
              <CardDescription>
                Analyze contributions with one click.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    defaultValue={createTeamName}
                    onChange={(event) => {
                      setCreateTeamName(event.target.value);
                    }}
                    id="name"
                    placeholder="Name of your project"
                  />
                </div>
                <div className="flex flex-col space-y-1.5"></div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between w-full">
              <Button
                className="w-full"
                disabled={
                  selectedGithubRepos.length == 0 ||
                  createTeamName.trim().length == 0
                }
                onClick={handleCreateTeam}
              >
                Create
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
