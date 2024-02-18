import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { fetchUserTeams } from "./fetchUserTeams";
import { TeamRegisterDto } from "./types/team.dto";
import { registerUserTeam } from "./registerUserTeam";

export async function GET() {
  const session = await getServerSession(options);
  if (session?.userId) {
    const userTeams = await fetchUserTeams(session.userId);
    return NextResponse.json({
      success: true,
      userTeams: userTeams,
    });
  }
  return NextResponse.json({ success: false, userTeams: [] });
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
