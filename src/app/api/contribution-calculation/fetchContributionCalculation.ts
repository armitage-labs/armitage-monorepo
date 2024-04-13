import prisma from "db";

export type ContributionCalculation = {
  id: string;
  team_id: string;
  created_at: Date;
  score_interval: object[] | null;
};

export async function fetchContributionCalculation(
  teamId: string,
): Promise<ContributionCalculation | null> {
  const contributionCalculation =
    await prisma.contributionCalculation.findFirst({
      where: {
        Team: {
          id: teamId,
        },
      },
    });
  return contributionCalculation as ContributionCalculation;
}
