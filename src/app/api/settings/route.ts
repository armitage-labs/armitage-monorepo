import { NextResponse } from "next/server";

export async function GET() {
  const githubAppUrl = process.env.GITHUB_APP_URL;
  return NextResponse.json({
    success: true,
    settings: {
      githubAppUrl: githubAppUrl,
    },
  });
}
