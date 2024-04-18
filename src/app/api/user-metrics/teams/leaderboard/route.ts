import { NextRequest, NextResponse } from "next/server";
import {
  feachMaxTeamMetrics,
  feachUsersTeamMetrics,
  feachUsersTeamRpgMetics,
  fetchTeamUserMetrics,
} from "../../userMetricService";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  const teamId = req.nextUrl.searchParams.get("team_id");
  if (teamId && username) {
    const teamUserMetrics = await fetchTeamUserMetrics(teamId);
    const topTeamMetrics = await feachMaxTeamMetrics(teamUserMetrics);
    const userMetrics = await feachUsersTeamMetrics(username, teamUserMetrics);
    const rpgMetric = await feachUsersTeamRpgMetics(
      username,
      userMetrics,
      topTeamMetrics,
      teamUserMetrics,
    );
    return NextResponse.json({
      success: true,
      metrics: rpgMetric,
    });
  }
  return NextResponse.json({ success: false, metrics: [] });
}
