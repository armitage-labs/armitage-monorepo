import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";
import { fetchTeamContributorsByTeamId } from "./fetchTeamContributors";

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("team_id");
  const session = await getServerSession(options);
  if (session?.userId && teamId) {
    const teamContributorArray = await fetchTeamContributorsByTeamId(teamId);
    return NextResponse.json({
      success: true,
      teamContributors: teamContributorArray,
    });
  }
  return NextResponse.json({ success: false, gitRepos: [] });
}
