import { NextRequest, NextResponse } from "next/server";
import {
  activityUserMetrics,
  fetchTeamUserMetrics,
  sumUsersTeamMetrics,
} from "../../userMetricService";

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("team_id");
  const username = req.nextUrl.searchParams.get("username");
  if (teamId && username) {
    const teamMetrics = await fetchTeamUserMetrics(teamId);
    const mergedMetrics = await sumUsersTeamMetrics(teamMetrics);
    const activityMetrics = await activityUserMetrics(mergedMetrics);
    return NextResponse.json({
      success: true,
      metrics: activityMetrics,
    });
  }
  return NextResponse.json({ success: false, metrics: [] });
}
