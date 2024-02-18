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
    const foundRegisteredRepos = await prisma.githubRepo.findMany({
      where: {
        team_id: teamId,
      },
    });
    return foundRegisteredRepos as RegisteredGitRepo[];
  } catch (error) {
    console.log(error);
    return [];
  }
}
