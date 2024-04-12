import { NextRequest, NextResponse } from "next/server";
import { createAttestation } from "./service";

export async function GET(req: NextRequest) {
  const attestation = createAttestation({
    address: "0x1234567890123456789012345678901234567890",
    privateData: {
      organizationName: "armitagelabs",
      // repositoryName: "monorepo",
      // contributor: [],
      // measuredAt: "2022-11-28",
      // weightsConfig: { "prReview": "1", "pr": "1" }
    },
  });
  return NextResponse.json({
    success: true,
  });
}
