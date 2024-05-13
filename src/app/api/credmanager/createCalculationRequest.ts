import { ContributionRequest } from "@prisma/client";
import prisma from "db";

export async function createContributionRequest(
  teamId: string,
  gitHubToken: string,
  email: string,
): Promise<ContributionRequest> {
  const contributionRequest = await prisma.contributionRequest.create({
    data: {
      team_id: teamId,
      access_token: gitHubToken,
      email: email,
    },
  });
  return contributionRequest;
}
