import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { fetchUserContributorsInterval } from "../contributors/fetchUserContributors";
import { fetchTeamContributorsByUserId } from "../contributors/team/fetchTeamContributors";
import {
  calculatePercentageDifference,
  getIntervalForDate,
  mergeIntervals,
  numberUniqueContributors,
  sumScore,
} from "../utils/utils";

export async function GET() {
  const session = await getServerSession(options);
  if (session?.userId) {
    const userContributors = await fetchUserContributorsInterval(
      session?.userId,
    );

    const allTeamsContributors = await fetchTeamContributorsByUserId(
      session.userId,
    );
    const uniqueContributors = numberUniqueContributors(userContributors);
    const scoreInterval = mergeIntervals(userContributors);
    const totalScore = sumScore(allTeamsContributors);

    const thisWeekDate = new Date();
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    const weekScore = getIntervalForDate(thisWeekDate, scoreInterval);
    const lastWeek = getIntervalForDate(lastWeekDate, scoreInterval);

    return NextResponse.json({
      success: true,
      overview: {
        interval: scoreInterval,
        totalContributors: uniqueContributors,
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
    });
  }
}
