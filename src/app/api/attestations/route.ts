import { NextRequest, NextResponse } from "next/server";
import { getTeamAttestationData } from "./service";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  const session = await getServerSession(options);
  const teamId = req.nextUrl.searchParams.get("team_id");

  if (session?.userId && teamId) {
    const attestationData = await getTeamAttestationData(teamId);

    const reponse: any = {
      organizationName: attestationData?.organizationName,
      repositoryName: attestationData?.repositoryName,
      measuredAt: attestationData?.measuredAt,
      weightsConfig: attestationData?.weightsConfig,
    };
    attestationData?.contributor.forEach((contributor) => {
      reponse[contributor.githubUsername] = {
        rank: contributor.rank,
        score: contributor.score,
      };
    });

    return NextResponse.json({
      success: true,
      data: reponse,
    });
  }

  return NextResponse.json({
    success: false,
    data: null,
  });
}
