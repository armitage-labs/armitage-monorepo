import { RegisteredGitRepo } from "@/app/api/github/repo/registered/fetchRegisteredRepos";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface GithubRepoListProps {
  githubRepos: RegisteredGitRepo[];
}

export function GithubRepoList({ githubRepos }: GithubRepoListProps) {
  return (
    <ScrollArea className="max-h-96">
      <div className="space-y-8">
        {githubRepos.map((repo) => (
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback>{repo.name[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{repo.name}</p>
              <p className="text-sm text-muted-foreground">{repo.full_name}</p>
            </div>
            <div className="ml-auto font-medium">Active</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
