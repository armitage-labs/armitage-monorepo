import prisma from "db";

export type RegisteredGitRepo = {
  id: string;
  team_id: string;
  name: string;
  full_name: string;
};

export async function fetchAllGitReposForUser(
  userId: string,
): Promise<RegisteredGitRepo[]> {
  try {
    const foundRegisteredRepos = await prisma.githubRepo.findMany({
      where: {
        Team: {
          owner_user_id: userId,
        },
      },
    });
    return foundRegisteredRepos as RegisteredGitRepo[];
  } catch (error) {
    console.log(error);
    return [];
  }
}
