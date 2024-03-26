import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import {
  fetchUserContributorsByTeam,
  fetchUserContributorsByUser,
} from "./fetchUserContributors";

export async function GET(req: NextRequest) {
  const session = await getServerSession(options);
  const teamId = req.nextUrl.searchParams.get("team_id");
  let contributorsArray = [];
  if (session?.userId) {
    if (teamId != null) {
      contributorsArray = await fetchUserContributorsByTeam(teamId);
    } else {
      contributorsArray = await fetchUserContributorsByUser(session.userId);
    }
    return NextResponse.json({
      success: true,
      contributors: contributorsArray,
    });
  }
  return NextResponse.json({ success: false, gitRepos: [] });
}
