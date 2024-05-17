import { RegisterGitRepoDto } from "./repo/route";
import prisma from "db";

export async function registerProjectRepos(
  projectId: string,
  registerRepos: RegisterGitRepoDto[],
): Promise<void> {
  for (const registerRepo of registerRepos) {
    const foundRepo = await prisma.githubRepo.findFirst({
      where: {
        team_id: projectId,
        name: registerRepo.name,
        full_name: registerRepo.full_name,
      },
    });
    if (!foundRepo) {
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
