import prisma from "db";
import { NextResponse, NextRequest } from "next/server";
import { fetchPaginatedGithubRepoResult } from "./fetchRepositories";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page");
  const perPage = req.nextUrl.searchParams.get("per_page");
  const session = await getServerSession(options);
  if (session?.accessToken && session?.githubLogin) {
    const githubRepos = await fetchPaginatedGithubRepoResult(
      session.accessToken,
      Number(page || "1"),
      Number(perPage || "10"),
    );
    return NextResponse.json({ success: true, gitRepos: githubRepos });
  }
  return NextResponse.json({ success: false, gitRepos: [] });
}

export type GitRepoRegisterDto = {
  name: string;
  full_name: string;
  team_id: string;
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    const registerRepoDto = (await req.json()) as GitRepoRegisterDto;
    if (session?.userId) {
      const foundRepo = await prisma.githubRepo.findFirst({
        where: {
          team_id: registerRepoDto.team_id,
          name: registerRepoDto.name,
          full_name: registerRepoDto.full_name,
        },
      });
      if (!foundRepo) {
        await prisma.githubRepo.create({
          data: {
            team_id: registerRepoDto.team_id,
            name: registerRepoDto.name,
            full_name: registerRepoDto.full_name,
          },
        });
        return NextResponse.json({ success: true, created: true });
      }
      return NextResponse.json({ success: true, created: false });
    }
    return NextResponse.json({ success: false, created: false });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, created: false });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const deleteRepoFullName = req.nextUrl.searchParams.get("full_name");
    const teamId = req.nextUrl.searchParams.get("team_id");
    if (deleteRepoFullName && teamId) {
      await prisma.githubRepo.delete({
        where: {
          team_id_full_name: {
            team_id: teamId,
            full_name: deleteRepoFullName,
          },
        },
      });
      return NextResponse.json({
        success: true,
        deleted: true,
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, deleted: false });
  }
}
