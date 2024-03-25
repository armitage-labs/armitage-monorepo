import prisma from "db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { registerUserTeam } from "../teams/registerUserTeam";
import { options } from "../auth/[...nextauth]/options";

export type SingleRepositoryTeamRegisterDto = {
  repositoryFullName: string;
  repositoryName: string;
};

// fetch all teams that are singleRepo teams
export async function GET(req: NextRequest) {
  const session = await getServerSession(options);

}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    const registerRepoDto = (await req.json()) as SingleRepositoryTeamRegisterDto;
    if (session?.userId) {
      const createdTeam = await registerUserTeam(
        session.userId,
        registerRepoDto.repositoryFullName,
        true,
      );
      await prisma.githubRepo.create({
        data: {
          team_id: createdTeam.id,
          name: registerRepoDto.repositoryName,
          full_name: registerRepoDto.repositoryFullName,
        },
      })
      return NextResponse.json({ success: true, createdTeam: createdTeam });
    }
    return NextResponse.json({ success: true, createdTeam: null });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, createdTeam: null });
  }
}
