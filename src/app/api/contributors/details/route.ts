import { NextRequest, NextResponse } from "next/server";
import { fetchContributorDetails } from "./fetchContributorDetails";

export async function GET(req: NextRequest) {
  const contributorUserName = req.nextUrl.searchParams.get(
    "contributor_username",
  );
  if (contributorUserName) {
    const contributorDetails =
      await fetchContributorDetails(contributorUserName);
    return NextResponse.json({
      success: true,
      contributorDetails: contributorDetails,
    });
  }
  return NextResponse.json({ success: false, contributorDetails: null });
}
