import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { fetchContributionRequest } from "./fetchContributionRequest";

export async function GET() {
  const session = await getServerSession(options);
  if (session?.userId) {
    const hasContributionRequest = await fetchContributionRequest(session.userId);
    return NextResponse.json({
      success: true,
      hasContributionRequest: hasContributionRequest !== null,
    });
  }
  return NextResponse.json({ success: false, hasContributionReques: false });
}
