import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { getUserTeamAttestationData } from "../service";

export type AttestationPublicDataDto = {
  githubUsername: string;
  measuredAt: string;
  repositoryName: string;
  organizationName: string;
  prNodeWeight: string;
  prReviewNodeWeight: string;
  issueNodeWeight: string;
  commentNodeWeight: string;
  commitNodeWeight: string;
  userScoreRank: string;
  userCredScore: string;
  userCredScorePercentage: string;
};

export interface SaveAttestationRequestDto {
  chain_id: string;
  attestation_uuid: string;
  team_id: string;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(options);
  const teamId = req.nextUrl.searchParams.get("team_id");
  if (session?.githubLogin && teamId) {
    const attestationData = await getUserTeamAttestationData(
      session.githubLogin,
      teamId,
    );
    return NextResponse.json({
      success: true,
      attestationData: attestationData,
    });
  }

  return NextResponse.json({
    success: false,
    attestationData: null,
  });
}
