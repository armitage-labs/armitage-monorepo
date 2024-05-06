import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";
import { registerProjectRepos } from "../projectsService";

export type GitReposRegisterRequest = {
  repos: RegisterGitRepoDto[];
  projectId: string;
};

export type RegisterGitRepoDto = {
  name: string;
  full_name: string;
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(options);
    const registerRepoDto = (await req.json()) as GitReposRegisterRequest;
    if (session?.userId && registerRepoDto) {
      await registerProjectRepos(
        registerRepoDto.projectId,
        registerRepoDto.repos,
      );
      return NextResponse.json({ success: true, created: true });
    }
    return NextResponse.json({ success: false, created: false });
  } catch (error) {
    return NextResponse.json({ success: false, created: false });
  }
}
