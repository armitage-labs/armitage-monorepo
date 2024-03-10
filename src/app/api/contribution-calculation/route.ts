import { NextRequest, NextResponse } from "next/server";
import { fetchContributionCalculation } from "./fetchContributionCalculation";


export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("team_id");
  if (teamId) {
    const contributionCalculation = await fetchContributionCalculation(teamId);
    return NextResponse.json({
      success: true,
      contributionCalculation: contributionCalculation,
    });
  }
  return NextResponse.json({ success: false, contributionCalculation: false });
}
