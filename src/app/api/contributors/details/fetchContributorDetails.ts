import { GithubRepo, Team } from "@prisma/client";
import prisma from "db";

export type ContributorDetailsDto = {
  userName: string;
  teams: Team[];
  github_repositories: GithubRepo[];
};

/**
 * Fetch contributor details by userName
 * Fetches the teams in which the username is a contributor (case insensitive) and the github repositories of those teams
 * @param {string} contributorUserName
 * @returns {Object} ContributorDetailsDto
 */
export async function fetchContributorDetails(
  contributorUserName: string,
): Promise<ContributorDetailsDto | null> {
  try {
    const foundContributorTeams = await prisma.team.findMany({
      where: {
        ContributionCalculation: {
          some: {
            UserScore: {
              some: {
                username: {
                  equals: contributorUserName,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      },
    });
    const contributorTeams = foundContributorTeams.map((team) => team.name);
    const foundContributorRepositories = await prisma.githubRepo.findMany({
      where: {
        Team: {
          name: {
            in: contributorTeams,
          },
        },
      },
    });
    const contributorDetailsDto: ContributorDetailsDto = {
      userName: contributorUserName,
      teams: foundContributorTeams,
      github_repositories: foundContributorRepositories,
    };
    return contributorDetailsDto;
  } catch (error) {
    console.log(error);
  }
  return null;
}
