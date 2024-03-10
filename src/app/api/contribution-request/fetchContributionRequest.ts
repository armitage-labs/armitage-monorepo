import { ContributionRequest } from "@prisma/client";
import prisma from "db";

export async function fetchContributionRequest(
  teamId: string,
): Promise<ContributionRequest | null> {
  const foundContributionRequest = await prisma.contributionRequest.findFirst({
    where: {
      Team: {
        id: teamId,
      },
    },
  });
  return foundContributionRequest;
}
