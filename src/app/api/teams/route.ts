import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { fetchUserTeams } from "./fetchUserTeams";
import { fetchUserTeam } from "./fetchTeam";
import { TeamRegisterDto } from "./types/team.dto";
import { registerUserTeam } from "./registerUserTeam";

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
  return NextResponse.json({ success: true, userTeams: [] });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    const registerRepoDto = (await req.json()) as TeamRegisterDto;
    if (session?.userId) {
      const createdTeam = await registerUserTeam(
        session.userId,
        registerRepoDto.name,
      );
      return NextResponse.json({ success: true, createdTeam: createdTeam });
    }
    return NextResponse.json({ success: true, createdTeam: null });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, createdTeam: null });
  }
}
