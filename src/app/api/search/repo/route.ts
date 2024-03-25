import { NextRequest, NextResponse } from "next/server";
import { GithubRepoDto } from "../../github/repo/types/githubRepo.dto";

export async function GET(req: NextRequest) {
  const repoName = req.nextUrl.searchParams.get("name");

  const repoSearchResponse = await fetch(
    `https://api.github.com/repos/${repoName}`,
    {
      method: "GET",
    },
  );

  const repoSearchText = await repoSearchResponse.text();
  const foundRepo = JSON.parse(repoSearchText) as GithubRepoDto;
  if (foundRepo?.id != null) {
    return NextResponse.json({
      success: true,
      count: 1,
      results: [foundRepo],
    });
  }
  return NextResponse.json({
    success: true,
    count: 0,
    results: [],
  });
}
