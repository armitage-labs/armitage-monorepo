import { ContributionCalculation } from "@prisma/client";
import prisma from "db";

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
  return contributionCalculation;
}
