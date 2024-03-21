import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { fetchUserTeams } from "../../fetchUserTeams";
import { fetchContributionCalculation } from "@/app/api/contribution-calculation/fetchContributionCalculation";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export type TeamIntervalsOverviewDto = {
  teamName: string;
  intervals: Interval[];
};

export type Interval = {
  start: number;
  end: number;
  score: number;
};

export type ScoreIntervalDto = {
  eTime: number;
  sTime: number;
  value: number;
};

export async function GET() {
  const session = await getServerSession(options);
  if (session?.userId) {
    const teamIntervalsArray: TeamIntervalsOverviewDto[] = [];
    const userTeams = await fetchUserTeams(session.userId);

    if (userTeams.length > 0) {
      for (const team of userTeams) {
        const teamContributionCalculation = await fetchContributionCalculation(
          team.id,
        );
        if (teamContributionCalculation) {
          const teamIntervals =
            teamContributionCalculation.score_interval as Prisma.JsonArray;
          const intervalArray: Interval[] = [];
          teamIntervals.forEach((interval) => {
            const parsedInterval = interval as ScoreIntervalDto;
            intervalArray.push({
              start: parsedInterval.sTime,
              end: parsedInterval.eTime,
              score: parsedInterval.value,
            });
          });

          teamIntervalsArray.push({
            teamName: team.name,
            intervals: intervalArray,
          });
          console.log(teamIntervals);
        }
      }
    }

    return NextResponse.json({
      success: true,
      teamOverviewIntervals: teamIntervalsArray,
    });
  }
  return NextResponse.json({
    success: false,
    teamOverviewIntervals: [],
  });
}
