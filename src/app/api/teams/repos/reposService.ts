import { GithubRepo } from "@prisma/client";

export async function fetchTeamRepos(teamId: string): Promise<GithubRepo[]> {
  const repos = await prisma.githubRepo.findMany({
    where: {
      team_id: teamId,
    },
  });
  return repos;
}
