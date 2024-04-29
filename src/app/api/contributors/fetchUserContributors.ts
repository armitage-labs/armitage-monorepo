import prisma from "db";

export type ContributorDto = {
  userName: string;
  contributionScore: number;
  contributionScorePercentage: number;
};

export type ContributorViewDto = {
  userName: string;
  contributionScore: number;
  contributionScorePercentage: number;
  teams: string[];
};

export type UserScoreDto = {
  id: string;
  contribution_calculation_id: string;
  username: string;
  user_type: string;
  score: string;
  score_interval: any;
  created_at: Date;
};

export async function fetchUserContributorsByUser(
  userId: string,
): Promise<ContributorDto[]> {
  try {
    // fetch userScores where calculation is part of a team
    // which the owner is the userId
    const foundUserScores = await prisma.userScore.findMany({
      where: {
        user_type: "USER",
        contribution_calculation: {
          Team: {
            owner_user_id: userId,
          },
        },
      },
    });
    const userContributors = transformUserScoresToContributors(foundUserScores);
    return userContributors;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function fetchUserContributorsByTeam(
  teamId: string,
): Promise<ContributorDto[]> {
  try {
    // fetch userScores where calculation is part of a team
    // which the owner is the userId
    const foundUserScores = await prisma.userScore.findMany({
      where: {
        user_type: "USER",
        contribution_calculation: {
          Team: {
            id: teamId,
          },
        },
      },
    });
    const userContributors = transformUserScoresToContributors(foundUserScores);
    return userContributors;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function fetchUserContributorsInterval(
  userId: string,
): Promise<any[]> {
  try {
    // fetch userScores where calculation is part of a team
    // which the owner is the userId
    const foundUserScores = await prisma.userScore.findMany({
      where: {
        user_type: "USER",
        contribution_calculation: {
          Team: {
            owner_user_id: userId,
          },
        },
      },
    });
    return foundUserScores;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function fetchUserContributorsIntervalByTeam(
  teamId: string,
): Promise<any[]> {
  try {
    // fetch userScores where calculation is part of a team
    // which the owner is the userId
    const foundUserScores = await prisma.userScore.findMany({
      where: {
        user_type: "USER",
        contribution_calculation: {
          Team: {
            id: teamId,
          },
        },
      },
    });
    return foundUserScores;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// export async function mergeContributorDtoWithTeams():

export function transformUserScoresToContributors(
  userScoresArray: UserScoreDto[],
): ContributorDto[] {
  // Transforms userScore into contributorDto
  // Sums up all contributions and divide the sum of a unique user name
  // to reach average per unique user
  const contributionScoreSumMap: Record<string, number> = {};
  let allContributionsSum: number = 0;
  const contributorsArray: ContributorDto[] = [];
  userScoresArray.forEach((userScore) => {
    if (!contributionScoreSumMap[userScore.username]) {
      contributionScoreSumMap[userScore.username] = parseFloat(userScore.score);
    } else {
      contributionScoreSumMap[userScore.username] += parseFloat(
        userScore.score,
      );
    }
    allContributionsSum += parseFloat(userScore.score);
  });
  for (const [key, value] of Object.entries(contributionScoreSumMap)) {
    contributorsArray.push({
      userName: key,
      contributionScore: value,
      contributionScorePercentage: (value / allContributionsSum) * 100,
    });
  }
  return contributorsArray;
}
