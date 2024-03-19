import { TeamContributorDto } from "../contributors/team/fetchTeamContributors";

export function getIntervalForDate(date: Date, scoreInterval: any[]) {
  for (const interval of scoreInterval) {
    const startDate = new Date(interval.sTime);
    const endDate = new Date(interval.eTime);
    if (startDate < date && endDate > date) {
      return interval.value;
    }
  }
  return 0;
}

export function mergeIntervals(userContributors: any[]): any[] {
  const map = new Map();
  userContributors?.forEach((userContributor) => {
    userContributor.score_interval?.forEach((interval: any) => {
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

export function calculatePercentageDifference(
  value1: number,
  value2: number,
): number {
  if (value1 == value2) {
    return 0;
  }

  const difference: number = value2 - value1;
  const percentageDifference: number = (difference / value1) * 100;
  return percentageDifference;
}

export function sumScore(teamContributors: TeamContributorDto[]) {
  let score = 0;
  teamContributors?.forEach((teamContributor) => {
    score += Number(teamContributor.contributionScore);
  });
  return score;
}

export function numberUniqueContributors(contributors: any[]): number {
  return new Set(contributors.map((contributor) => contributor.username)).size;
}
