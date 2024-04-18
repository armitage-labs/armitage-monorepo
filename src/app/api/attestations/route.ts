import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";
import { getTeamAttestationData, saveAttestation } from "./service";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";

interface AttestationDataResponse {
  [key: string]: string;
}

export interface SaveAttestationRequestDto {
  chain_id: string;
  attestation_uuid: string;
  team_id: string;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(options);
  const teamId = req.nextUrl.searchParams.get("team_id");

  if (session?.userId && teamId) {
    const attestationData = await getTeamAttestationData(teamId);
    const reponse: AttestationDataResponse = {
      organizationName: attestationData.organizationName,
      repositoryName: attestationData.repositoryName,
      measuredAt: attestationData.measuredAt,
      weightsConfig: JSON.stringify(attestationData.weightsConfig),
    };
    attestationData.contributor.forEach((contributor) => {
      reponse[contributor.githubUsername] = JSON.stringify({
        rank: contributor.rank,
        score: contributor.score,
      }).toString();
    });
    const userSalt = crypto
      .createHash("sha256")
      .update(session.userId + process.env.ATTESTATION_SECRET)
      .digest("hex");

    return NextResponse.json({
      success: true,
      privateAttestationData: reponse,
      userSalt: "0x" + userSalt,
    });
  }

  return NextResponse.json({
    success: false,
    privateAttestationData: null,
    userSalt: null,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  const saveAttestationRequest =
    (await req.json()) as SaveAttestationRequestDto;
  if (session?.userId) {
    const success = saveAttestation(session.userId, saveAttestationRequest);
    return NextResponse.json({
      success: success,
    });
  }
  return NextResponse.json({
    success: false,
  });
}
