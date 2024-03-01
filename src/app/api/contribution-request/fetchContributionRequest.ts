import { ContributionRequest } from "@prisma/client";
import prisma from "db";

export async function fetchContributionRequest(userId: string): Promise<ContributionRequest | null> {
  const foundContributionRequest = await prisma.contributionRequest.findFirst({
    where: {
      Team: {
        owner_user_id: userId,
      }
    }
  });
  return foundContributionRequest;
}
