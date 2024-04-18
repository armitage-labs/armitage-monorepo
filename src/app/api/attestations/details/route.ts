import { NextRequest, NextResponse } from "next/server";
import { findAttestation, findAttestationByUserId } from "../service";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  const uuid = req.nextUrl.searchParams.get("uuid");
  const session = await getServerSession(options);
  if (session?.userId) {
    if (uuid) {
      const attestation = await findAttestation(uuid);
      return NextResponse.json({
        success: true,
        attestation: attestation,
      });
    } else {
      const attestations = await findAttestationByUserId(session?.userId);
      return NextResponse.json({
        success: true,
        attestations: attestations,
      });
    }
  }
  return NextResponse.json({
    success: false,
    attestation: null,
  });
}
