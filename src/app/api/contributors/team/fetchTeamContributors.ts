import prisma from "db";

export type TeamContributorDto = {
  userName: string;
  contributionScore: number;
};

export async function fetchTeamContributors(
  userId: string,
  teamId: string
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

export async function fetchTeamScoreSum(teamId: string): Promise<number> {
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

  let score = 0;
  foundTeamContributors.forEach((foundTeamContributor) => {
    score += Number(foundTeamContributor.score);
  });
  return score;
}

export async function fetchTeamContributorsSum(
  teamId: string
): Promise<number> {
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
  return foundTeamContributors.length;
}
