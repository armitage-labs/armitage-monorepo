import { Prisma } from "@prisma/client";
import { Interval, ScoreIntervalDto, TeamIntervalsOverviewDto } from "./types";
import { Team } from "../../fetchUserTeams";
import { fetchContributionCalculation } from "@/app/api/contribution-calculation/fetchContributionCalculation";

export async function fetchAllTeamIntervals(userTeams: Team[]) {
  const teamIntervalsArray: TeamIntervalsOverviewDto[] = [];
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
      }
    }
  }
  return teamIntervalsArray;
}

export function filterLastThreeMonthsIntervals(
  teamIntervals: TeamIntervalsOverviewDto[],
) {
  for (const team of teamIntervals) {
    team.intervals = team.intervals.filter((interval) => {
      return interval.start >= Date.now() - 7776000000;
    });
    team.intervals.sort((a, b) => a.start - b.start);
  }
  return teamIntervals;
}
