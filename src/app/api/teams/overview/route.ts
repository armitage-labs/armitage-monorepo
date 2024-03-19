import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { fetchContributionCalculation } from "../../contribution-calculation/fetchContributionCalculation";
import {
  fetchTeamContributorsSum,
  fetchTeamScoreSum,
} from "../../contributors/team/fetchTeamContributors";

export async function GET(req: NextRequest) {
  const session = await getServerSession(options);
  const teamId = req.nextUrl.searchParams.get("team_id");

  if (session?.userId) {
    const contributionCalculation = await fetchContributionCalculation(teamId!);
    const numberOfContributors = await fetchTeamContributorsSum(teamId!);
    const totalScore = await fetchTeamScoreSum(teamId!);
    const thisWeekDate = new Date();
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    const scoreInterval = contributionCalculation?.score_interval as any[];
    const weekScore = getIntervalForDate(thisWeekDate, scoreInterval);

    return NextResponse.json({
      success: true,
      overview: {
        interval: scoreInterval,
        totalContributors: numberOfContributors,
        totalScore: totalScore,
        weekScore: weekScore,
        weekGrowth: (weekScore / totalScore) * 100,
        lastWeekScore: getIntervalForDate(lastWeekDate, scoreInterval),
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

function getIntervalForDate(date: Date, scoreInterval: any[]) {
  for (const interval of scoreInterval) {
    const startDate = new Date(interval.sTime);
    const endDate = new Date(interval.eTime);
    if (startDate < date && endDate > date) {
      return interval.value;
    }
  }
  return 0;
}
