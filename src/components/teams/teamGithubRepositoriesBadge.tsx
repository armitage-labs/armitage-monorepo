import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";

interface TeamGithubRepositoriesBadgeProps {
  repoFullName: string;
  handleUnregisterRepo: (page: string) => void;
}

export default function TeamGithubRepositoriesBadge({
  repoFullName,
  handleUnregisterRepo,
}: TeamGithubRepositoriesBadgeProps) {
  return (
    <>
      <Badge className="mr-2 p-2" variant={"outline"}>
        <Icons.gitHub className="mr-2 ml-2 h-4 w-4" />
        <span>{repoFullName}</span>
        <Icons.close
          className="mr-2 ml-2 h-4 w-4 cursor-pointer"
          onClick={() => handleUnregisterRepo(repoFullName)}
        />
      </Badge>
    </>
  );
}
