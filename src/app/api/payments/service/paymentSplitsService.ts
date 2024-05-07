import { Rock_3D } from "next/font/google";
import {
  ContributorDto,
  UserScoreDto,
} from "../../contributors/fetchUserContributors";
import prisma from "db";

export type PaymentSplitDto = {
  userName: string;
  contributionScore: number;
  contributionScorePercentage: number;
  paymentSplit?: number;
  walletAddress?: string;
};

export async function fetchUserPaymentContributorsByTeam(
  teamId: string
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
    const userContributors =
      await transformUserScoresToPaymentContributors(foundUserScores);
    const paymentSplits = removeNoWalletContributors(userContributors);
    return paymentSplits;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function fetchUserWalletByUsername(username: string) {
  return await prisma.user.findFirst({
    where: {
      username: username,
    },
    include: {
      UserWallet: true,
    },
  });
}

export async function transformUserScoresToPaymentContributors(
  userScoresArray: UserScoreDto[]
): Promise<PaymentSplitDto[]> {
  // Transforms userScore into contributorDto
  // Sums up all contributions and divide the sum of a unique user name
  // to reach average per unique user
  const contributionScoreSumMap: Record<string, number> = {};
  let allContributionsSum: number = 0;
  const contributorsArray: PaymentSplitDto[] = [];
  userScoresArray.forEach((userScore) => {
    if (!contributionScoreSumMap[userScore.username]) {
      contributionScoreSumMap[userScore.username] = parseFloat(
        (parseFloat(userScore.score) ?? 0).toFixed(2)
      );
    } else {
      contributionScoreSumMap[userScore.username] += parseFloat(
        (parseFloat(userScore.score) ?? 0).toFixed(2)
      );
    }
    allContributionsSum += parseFloat(userScore.score);
  });

  for (const [key, value] of Object.entries(contributionScoreSumMap)) {
    contributorsArray.push({
      userName: key,
      contributionScore: value,
      contributionScorePercentage: (value / allContributionsSum) * 100,
      paymentSplit: (value / allContributionsSum) * 100,
      walletAddress: (await fetchUserWalletByUsername(key))?.UserWallet
        ?.address,
    });
  }
  return contributorsArray;
}

export async function removeNoWalletContributors(
  userScoresArray: PaymentSplitDto[]
): Promise<PaymentSplitDto[]> {
  let payableContributionsSum: number = 0;
  userScoresArray.forEach((userScore) => {
    if (userScore.walletAddress) {
      payableContributionsSum += userScore.contributionScore;
    }
  });
  const armitageScore = calculatArmitageFeeScore(3, payableContributionsSum);
  userScoresArray.forEach((userScore) => {
    if (userScore.walletAddress) {
      userScore.paymentSplit =
        (userScore.contributionScore /
          (payableContributionsSum + armitageScore)) *
        100;
    } else {
      userScore.paymentSplit = 0;
    }
  });
  userScoresArray.push({
    userName: "armitage-labs",
    contributionScore: armitageScore,
    contributionScorePercentage: 3,
    paymentSplit: 3,
    walletAddress: "mywalletaddress",
  });
  return userScoresArray;
}

function calculatArmitageFeeScore(fee: number, totalScore: number): number {
  return (fee * totalScore) / (100 - fee);
}
