import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { fetchRegisteredGitRepos } from "./fetchRegisteredRepos";

export async function GET() {
  const session = await getServerSession(options);
  if (session?.userId) {
    const registeredRepos = await fetchRegisteredGitRepos(session.userId);
    return NextResponse.json({
      success: true,
      registeredRepos: registeredRepos,
    });
  }
  return NextResponse.json({ success: false, registeredRepos: [] });
}
