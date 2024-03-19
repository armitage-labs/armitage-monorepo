import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { fetchTeamContributorsByTeamId } from "../../contributors/team/fetchTeamContributors";
import { fetchUserContributorsIntervalByTeam } from "../../contributors/fetchUserContributors";
import {
  calculatePercentageDifference,
  getIntervalForDate,
  mergeIntervals,
  sumScore,
} from "../../utils/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(options);
  const teamId = req.nextUrl.searchParams.get("team_id");

  if (session?.userId && teamId) {
    const userContributors = await fetchUserContributorsIntervalByTeam(teamId);
    const teamContributors = await fetchTeamContributorsByTeamId(teamId);

    const thisWeekDate = new Date();
    const lastWeekDate = new Date();
    const numberOfContributors = teamContributors.length;
    const totalScore = sumScore(teamContributors);
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    const scoreInterval = mergeIntervals(userContributors);
    const weekScore = getIntervalForDate(thisWeekDate, scoreInterval);
    const lastWeek = getIntervalForDate(lastWeekDate, scoreInterval);

    return NextResponse.json({
      success: true,
      overview: {
        interval: scoreInterval,
        totalContributors: numberOfContributors,
        totalScore: totalScore,
        wowScore: calculatePercentageDifference(lastWeek, weekScore),
        weekScore: weekScore,
        weekGrowth: (weekScore / totalScore) * 100,
        lastWeekScore: lastWeek,
      },
    });
  } else {
    return NextResponse.json({
      success: false,
      overview: {
        interval: [],
      },
    });
  }
}
