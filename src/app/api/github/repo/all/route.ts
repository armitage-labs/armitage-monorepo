import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { fetchAllGitReposForUser } from "./fetchAllUserRepos";

export async function GET() {
  const session = await getServerSession(options);
  if (session?.userId) {
    const registeredRepos = await fetchAllGitReposForUser(session.userId);
    return NextResponse.json({
      success: true,
      registeredRepos: registeredRepos,
    });
  }
  return NextResponse.json({ success: false, registeredRepos: [] });
}
