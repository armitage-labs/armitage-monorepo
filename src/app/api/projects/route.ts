import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { fetchUserTeam } from "../teams/fetchTeam";
import { fetchUserTeams } from "../teams/fetchUserTeams";

export async function GET(req: NextRequest) {
  const session = await getServerSession(options);
  const teamId = req.nextUrl.searchParams.get("team_id");
  if (session?.userId) {
    if (teamId == null) {
      const userTeams = await fetchUserTeams(session.userId);
      return NextResponse.json({
        success: true,
        userTeams: userTeams,
      });
    } else {
      const userTeam = await fetchUserTeam(session.userId, teamId);
      return NextResponse.json({
        success: true,
        userTeams: userTeam,
      });
    }
  }
}
