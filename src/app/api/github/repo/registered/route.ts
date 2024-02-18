import { NextRequest, NextResponse } from "next/server";
import { fetchRegisteredGitRepos } from "./fetchRegisteredRepos";

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("team_id");
  if (teamId) {
    const registeredRepos = await fetchRegisteredGitRepos(teamId);
    return NextResponse.json({
      success: true,
      registeredRepos: registeredRepos,
    });
  }
  return NextResponse.json({ success: false, registeredRepos: [] });
}
