export type RegisteredGitRepo = {
  id: string;
  user_id: string;
  name: string;
  full_name: string;
};

export async function fetchRegisteredGitRepos(
  userId: string,
): Promise<RegisteredGitRepo[]> {
  try {
    const foundRegisteredRepos = await prisma.githubRepo.findMany({
      where: {
        user_id: userId,
      },
    });
    return foundRegisteredRepos as RegisteredGitRepo[];
  } catch (error) {
    console.log(error);
    return [];
  }
}
