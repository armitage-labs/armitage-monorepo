import { getTeamWeightConfigsForAttestation } from "../configuration/configurationService";
import { fetchContributionCalculation } from "../contribution-calculation/fetchContributionCalculation";
import { fetchUserContributorsByTeam } from "../contributors/fetchUserContributors";
import { fetchRegisteredGitRepos } from "../github/repo/registered/fetchRegisteredRepos";
import { WeightConfigAttestation } from "../configuration/weightConfig.dto";

export type AttestationPrivateDataDto = {
  organizationName: string;
  repositoryName: string;
  contributor: ContributorDataDto[];
  measuredAt: string;
  weightsConfig: WeightConfigAttestation[];
};

export type ContributorDataDto = {
  githubUsername: string;
  rank: number;
  score: number;
};

export type AttestationUuidDto = {
  attestationUuid: string;
};

export async function getTeamAttestationData(
  teamId: string,
): Promise<AttestationPrivateDataDto | null> {
  const repoList = await fetchRegisteredGitRepos(teamId);
  if (repoList.length != 1) {
    throw new Error("Team has more than one repo");
  }

  const contributionCalculation = await fetchContributionCalculation(teamId);
  if (contributionCalculation == null) {
    throw new Error("Team does not have calculation");
  }

  const repo = repoList[0];
  const contributors = await fetchUserContributorsByTeam(teamId);
  const weightsConfig = await getTeamWeightConfigsForAttestation(teamId);

  return {
    organizationName: repo.full_name.split("/")[0],
    repositoryName: repo.full_name,
    contributor: contributors
      .sort((a, b) => b.contributionScore - a.contributionScore)
      .map((contributor, index) => {
        return {
          githubUsername: contributor.userName,
          rank: index + 1,
          score: contributor.contributionScore,
        };
      }),
    measuredAt: contributionCalculation.created_at.toDateString(),
    weightsConfig: weightsConfig,
  };
}
