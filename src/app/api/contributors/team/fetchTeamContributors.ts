import prisma from "db";

export type TeamContributorDto = {
  userName: string;
  contributionScore: number;
};

export async function fetchTeamContributorsByUserId(
  userId: string,
): Promise<TeamContributorDto[]> {
  const foundTeamContributors = await prisma.userScore.findMany({
    where: {
      user_type: "USER",
      contribution_calculation: {
        Team: {
          owner_user_id: userId,
        },
      },
    },
  });
  const teamContributorDto = foundTeamContributors.map((contributor) => {
    return {
      userName: contributor.username,
      contributionScore: parseFloat(contributor.score),
    } as TeamContributorDto;
  });
  return teamContributorDto;
}

export async function fetchTeamContributorsByTeamId(
  teamId: string,
): Promise<TeamContributorDto[]> {
  const foundTeamContributors = await prisma.userScore.findMany({
    where: {
      user_type: "USER",
      contribution_calculation: {
        Team: {
          id: teamId,
        },
      },
    },
  });

  const teamContributorDto = foundTeamContributors.map((contributor) => {
    return {
      userName: contributor.username,
      contributionScore: parseFloat(contributor.score),
    } as TeamContributorDto;
  });
  return teamContributorDto;
}
