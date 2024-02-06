import { NextResponse } from "next/server";
import { fetchPaginatedGithubRepoResult } from "./fetchRepositories";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function GET() {
  const session = await getServerSession(options);
  console.log("route!");
  console.log(session);
  if (session?.accessToken && session?.githubLogin) {
    const githubRepos = await fetchPaginatedGithubRepoResult(
      session.accessToken,
      session.githubLogin,
    );
    return NextResponse.json({ success: true, gitRepos: githubRepos });
  }
  return NextResponse.json({ success: false, gitRepos: [] });
}
