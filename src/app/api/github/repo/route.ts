import prisma from "db";
import { NextResponse, NextRequest } from "next/server";
import { fetchPaginatedGithubRepoResult } from "./fetchRepositories";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function GET() {
  const session = await getServerSession(options);
  if (session?.accessToken && session?.githubLogin) {
    const githubRepos = await fetchPaginatedGithubRepoResult(
      session.accessToken,
      session.githubLogin,
    );
    return NextResponse.json({ success: true, gitRepos: githubRepos });
  }
  return NextResponse.json({ success: false, gitRepos: [] });
}

export type GitRepoRegisterDto = {
  name: string;
  full_name: string;
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    const registerRepoDto = (await req.json()) as GitRepoRegisterDto;
    if (session?.userId) {
      const foundRepo = await prisma.githubRepo.findFirst({
        where: {
          user_id: session.userId,
          name: registerRepoDto.name,
          full_name: registerRepoDto.full_name,
        },
      });
      if (!foundRepo) {
        await prisma.githubRepo.create({
          data: {
            user_id: session.userId,
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
    const session = await getServerSession(options);
    const deleteRepoFullName = req.nextUrl.searchParams.get("full_name");
    if (session?.userId && deleteRepoFullName) {
      await prisma.githubRepo.delete({
        where: {
          full_name: deleteRepoFullName,
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
