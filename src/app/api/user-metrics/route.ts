import { NextRequest, NextResponse } from "next/server";
import {
  feachMaxTeamMetrics,
  feachUsersTeamMetrics,
  feachUsersTeamRpgMetics,
  fetchTeamUserMetrics,
} from "./userMetricService";

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("team_id");
  const username = req.nextUrl.searchParams.get("username");
  const repoName = req.nextUrl.searchParams.get("repo_name");
  if (teamId && username && repoName) {
    const teamUserMetrics = await fetchTeamUserMetrics(teamId, repoName);
    const topTeamMetrics = await feachMaxTeamMetrics(teamUserMetrics);
    const userMetrics = await feachUsersTeamMetrics(username, teamUserMetrics);
    const rpgMetric = await feachUsersTeamRpgMetics(
      userMetrics,
      topTeamMetrics,
    );
    return NextResponse.json({
      success: true,
      metrics: rpgMetric,
    });
  }
  return NextResponse.json({ success: false, metrics: [] });
}
