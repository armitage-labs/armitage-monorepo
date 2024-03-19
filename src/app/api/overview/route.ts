import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { fetchUserContributorsInterval } from "../contributors/fetchUserContributors";
import { fetchScoreSum } from "../contributors/team/fetchTeamContributors";

export async function GET(req: NextRequest) {
  const session = await getServerSession(options);
  if (session?.userId) {
    const userContributors = await fetchUserContributorsInterval(
      session?.userId,
    );

    const totalScore = await fetchScoreSum(session!.userId!);
    const scoreInterval = mergeIntervals(userContributors);

    const thisWeekDate = new Date();
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    const weekScore = getIntervalForDate(thisWeekDate, scoreInterval);

    return NextResponse.json({
      success: true,
      overview: {
        totalScore: totalScore,
        weekScore: weekScore,
        weekGrowth: (weekScore / totalScore) * 100,
        interval: scoreInterval,
      },
    });
  } else {
    return NextResponse.json({
      success: false,
    });
  }
}

function mergeIntervals(userContributors: any[]): any[] {
  const map = new Map();
  userContributors.forEach((userContributor) => {
    userContributor.score_interval.forEach((interval: any) => {
      const intervalRow = map.get(interval.eTime);
      if (intervalRow) {
        intervalRow.value = intervalRow.value + interval.value;
        map.set(interval.eTime, intervalRow);
      } else {
        map.set(interval.eTime, interval);
      }
    });
  });
  return Array.from(map.values());
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
