import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { fetchUserContributors } from "./fetchUserContributors";

export async function GET() {
  const session = await getServerSession(options);
  if (session?.userId) {
    const contributorsArray = await fetchUserContributors(session.userId);
    return NextResponse.json({
      success: true,
      contributors: contributorsArray,
    });
  }
  return NextResponse.json({ success: false, gitRepos: [] });
}
