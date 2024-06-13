import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { fetchUserTeam } from "../teams/fetchTeam";
import { fetchUserTeams } from "../teams/fetchUserTeams";
import { ProjectRegisterDto } from "./types/project.dto";
import { registerUserTeam } from "../teams/registerUserTeam";
import { deleteTeam } from "../teams/deleteTeam";

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
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    const teamId = req.nextUrl.searchParams.get("team_id");
    if (teamId && session?.userId) {
      await deleteTeam(teamId, session.userId);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    const registerProjectDto = (await req.json()) as ProjectRegisterDto;
    if (session?.userId) {
      const createdProject = await registerUserTeam(
        session.userId,
        registerProjectDto.name,
        registerProjectDto.repoCount == 1,
      );
      return NextResponse.json({
        success: true,
        createdProject: createdProject,
      });
    }
    return NextResponse.json({ success: true, createdProject: null });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, createdProject: null });
  }
}
