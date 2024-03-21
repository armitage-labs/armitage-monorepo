import { TeamIntervalsOverviewDto } from "@/app/api/teams/overview/intervals/route";

export interface TeamIntervalsOverviewProps {
  teamIntervalsOverview: TeamIntervalsOverviewDto[];
}

export interface TeamIntervalsChartData {
  start: number;
  end: number;
  teamScores: { name: string; score: number }[];
}

export interface TeamUtils {
  teamNameToIndex: Map<string, number>;
}
