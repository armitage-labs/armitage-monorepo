import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";
import { fetchUserPaymentContributorsByTeam } from "../service/paymentSplitsService";

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("team_id");
  const session = await getServerSession(options);
  if (session?.userId && teamId) {
    const contributorsArray = await fetchUserPaymentContributorsByTeam(teamId);
    return NextResponse.json({
      success: true,
      contributors: contributorsArray,
    });
  }
  return NextResponse.json({ success: false, gitRepos: [] });
}
