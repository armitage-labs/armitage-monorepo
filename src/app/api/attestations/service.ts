import { getTeamWeightConfigsForAttestation } from "../configuration/configurationService";
import { fetchContributionCalculation } from "../contribution-calculation/fetchContributionCalculation";
import { fetchUserContributorsByTeam } from "../contributors/fetchUserContributors";
import { fetchRegisteredGitRepos } from "../github/repo/registered/fetchRegisteredRepos";
import { WeightConfigAttestation } from "../configuration/weightConfig.dto";
import { SaveAttestationRequestDto } from "./route";
import prisma from "db";
import { fetchTeam } from "../teams/fetchTeam";

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

export type AttestationDto = {
  id: string;
  chain_id: string;
  user_id: string;
  team_id: string;
  contribution_calculation_id: string;
  attestation_uuid: string;
  team?: {
    id: string;
    teamName: string;
  };
};

export async function findAttestation(uuid: string): Promise<AttestationDto> {
  const attestation = await prisma.attestation.findFirst({
    where: {
      attestation_uuid: uuid,
    },
  });
  return attestation as AttestationDto;
}

export async function findAttestationByUserId(
  userId: string,
): Promise<AttestationDto[]> {
  const attestation = await prisma.attestation.findMany({
    where: {
      user_id: userId,
    },
  });
  return addTeamNameToAttestation(attestation as AttestationDto[]);
}

export async function getTeamAttestationData(
  teamId: string,
): Promise<AttestationPrivateDataDto> {
  const repoList = await fetchRegisteredGitRepos(teamId);
  if (repoList.length != 1) {
    throw new Error("Team has to have one repo");
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
    repositoryName: repo.full_name.split("/")[1],
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

export async function saveAttestation(
  userId: string,
  attestation: SaveAttestationRequestDto,
): Promise<boolean> {
  const lastTeamCalculation = await fetchContributionCalculation(
    attestation.team_id,
  );
  if (lastTeamCalculation) {
    await prisma.attestation.create({
      data: {
        chain_id: attestation.chain_id,
        attestation_uuid: attestation.attestation_uuid,
        user_id: userId,
        team_id: attestation.team_id,
        contribution_calculation_id: lastTeamCalculation.id,
      },
    });
  }
  return true;
}

async function addTeamNameToAttestation(
  attestations: AttestationDto[],
): Promise<AttestationDto[]> {
  for (const attestation of attestations) {
    const team = await fetchTeam(attestation.team_id);
    attestation.team = {
      id: team.id,
      teamName: team.name,
    };
  }
  return attestations;
}
