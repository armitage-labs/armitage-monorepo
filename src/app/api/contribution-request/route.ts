import { NextRequest, NextResponse } from "next/server";
import { fetchContributionRequest } from "./fetchContributionRequest";

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("team_id");
  if (teamId) {
    const hasContributionRequest = await fetchContributionRequest(
      teamId
    );
    return NextResponse.json({
      success: true,
      hasContributionRequest: hasContributionRequest !== null,
    });
  }
  return NextResponse.json({ success: false, hasContributionReques: false });
}
