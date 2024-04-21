import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";
import { fetchTeamRepos } from "./reposService";

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("team_id");
  const session = await getServerSession(options);
  if (session && teamId) {
    const githubRepos = await fetchTeamRepos(teamId);
    return NextResponse.json({ success: true, repos: githubRepos });
  }
  return NextResponse.json({ success: false, repos: [] });
}
