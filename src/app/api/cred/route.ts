import { NextRequest, NextResponse } from "next/server";
import { fetchUserCred } from "./fetchTeamCredScore";

export interface UserCredDto {
  totalCred: number;
  userName: string;
  type: string;
}

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("team_id");
  if (teamId) {
    const userTeams = await fetchUserCred(teamId);
    return NextResponse.json({
      success: true,
      userCreds: userTeams,
    });
  }
}
