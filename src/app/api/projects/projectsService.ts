import { RegisterGitRepoDto } from "./repo/route";

export async function registerProjectRepos(
  projectId: string,
  registerRepos: RegisterGitRepoDto[],
): Promise<void> {
  for (const registerRepo of registerRepos) {
    console.log(registerRepo);
    const foundRepo = await prisma.githubRepo.findFirst({
      where: {
        team_id: projectId,
        name: registerRepo.name,
        full_name: registerRepo.full_name,
      },
    });
    console.log("Found?");
    console.log(foundRepo);
    if (!foundRepo) {
      console.log("Created");
      await prisma.githubRepo.create({
        data: {
          team_id: projectId,
          name: registerRepo.name,
          full_name: registerRepo.full_name,
        },
      });
    }
  }
}
