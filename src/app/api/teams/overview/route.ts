import { NextRequest, NextResponse } from "next/server";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import {
  TeamContributorDto,
  fetchTeamContributorsByTeamId,
} from "../../contributors/team/fetchTeamContributors";
import { fetchUserContributorsIntervalByTeam } from "../../contributors/fetchUserContributors";

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

function calculatePercentageDifference(value1: number, value2: number): number {
  const difference: number = value2 - value1;
  const percentageDifference: number = (difference / value1) * 100;
  return percentageDifference;
}

function sumScore(teamContributors: TeamContributorDto[]) {
  let score = 0;
  teamContributors.forEach((teamContributor) => {
    score += Number(teamContributor.contributionScore);
  });
  return score;
}
