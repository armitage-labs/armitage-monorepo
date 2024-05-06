import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";

interface ProjectGithubRepositoriesBadgeProps {
  githubRepoDto: GithubRepoDto;
  handleUnregisterRepo: (
    githubRepoDto: GithubRepoDto,
    selected: boolean,
  ) => void;
}

export default function ProjectGithubRepositoriesBadge({
  githubRepoDto,
  handleUnregisterRepo,
}: ProjectGithubRepositoriesBadgeProps) {
  return (
    <>
      <Badge className="mr-2 p-2 whitespace-no-wrap" variant={"outline"}>
        <Icons.gitHub className="mr-2 ml-2 h-4 w-4" />
        <span className="whitespace-no-wrap">{githubRepoDto.full_name}</span>
        <Icons.close
          className="mr-2 ml-2 h-4 w-4 cursor-pointer"
          onClick={() => handleUnregisterRepo(githubRepoDto, false)}
        />
      </Badge>
    </>
  );
}
