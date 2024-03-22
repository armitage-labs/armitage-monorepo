import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { fetchUserTeams } from "../../fetchUserTeams";
import { NextResponse } from "next/server";
import { fetchAllTeamIntervals, filterLastThreeMonthsIntervals } from "./utils";

export async function GET() {
  const session = await getServerSession(options);
  if (session?.userId) {
    const userTeams = await fetchUserTeams(session.userId);
    const allTeamIntervals = await fetchAllTeamIntervals(userTeams);
    const filteredTeaminvervals =
      filterLastThreeMonthsIntervals(allTeamIntervals);

    return NextResponse.json({
      success: true,
      teamOverviewIntervals: filteredTeaminvervals,
    });
  }
  return NextResponse.json({
    success: false,
    teamOverviewIntervals: [],
  });
}
