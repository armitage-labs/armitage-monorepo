import { NextRequest, NextResponse } from "next/server";
import { findAttestation } from "../service";

export async function GET(req: NextRequest) {
  const uuid = req.nextUrl.searchParams.get("uuid");
  if (uuid) {
    const attestation = await findAttestation(uuid);
    return NextResponse.json({
      success: true,
      attestation: attestation,
    });
  }
  return NextResponse.json({
    success: false,
    attestation: null,
  });
}
