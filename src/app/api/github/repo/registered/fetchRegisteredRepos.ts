import prisma from "db";

export type RegisteredGitRepo = {
  id: string;
  team_id: string;
  name: string;
  full_name: string;
};

export async function fetchRegisteredGitRepos(
  teamId: string,
): Promise<RegisteredGitRepo[]> {
  try {
    console.log("fetching registered repos for team", teamId);
    const foundRegisteredRepos = await prisma.githubRepo.findMany({
      where: {
        team_id: teamId,
      },
    });
    console.log("found registered repos", foundRegisteredRepos);
    return foundRegisteredRepos as RegisteredGitRepo[];
  } catch (error) {
    console.log(error);
    return [];
  }
}
