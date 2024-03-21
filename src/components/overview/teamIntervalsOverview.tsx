import {
  XAxis,
  Tooltip,
  TooltipProps,
  ResponsiveContainer,
  Line,
  LineChart,
  AreaChart,
  Area,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamIntervalsOverviewDto } from "@/app/api/teams/overview/intervals/route";

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        {payload.map((data) => {
          return (
            <div>
              <p className="label">{`${data.dataKey}: ${parseFloat(data.value!.toString()).toPrecision(3)}`}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

interface TeamIntervalsOverviewProps {
  teamIntervalsOverview: TeamIntervalsOverviewDto[];
}

interface TeamIntervalsChartData {
  start: number;
  end: number;
  teamScores: { name: string; score: number }[];
}

function indexToColor(index: number): string {
  //switch case for index
  switch (index) {
    case 0:
      return "#adfa1d";
    case 1:
      return "#A4FFFF";
    case 2:
      return "#FFB86C";
    case 3:
      return "#242c54";
    case 4:
      return "#A4FFFF";
    case 5:
      return "#FFFFFF";
    default:
      return "#FFFFFF";
  }
}

export function TeamIntervalsOverview({
  teamIntervalsOverview,
}: TeamIntervalsOverviewProps) {
  const uniqueTeamNames = teamIntervalsOverview.map((team) => {
    return team.teamName;
  });
  const teamNameToIndex = new Map<string, number>();
  uniqueTeamNames.forEach((team, index) => {
    teamNameToIndex.set(team, index);
  });
  let teamIntervalChartData: TeamIntervalsChartData[] = [];
  const scoresMappedByStart = new Map<
    number,
    { name: string; score: number }[]
  >();
  const endMappedByStart = new Map<number, number>();
  const uniqueStarts: number[] = [];
  let counter = 0;
  for (const team of teamIntervalsOverview) {
    team.intervals.forEach((interval) => {
      if (!uniqueStarts.includes(interval.start)) {
        uniqueStarts.push(interval.start);

        scoresMappedByStart.set(interval.start, [
          { name: team.teamName, score: interval.score },
        ]);
        endMappedByStart.set(interval.start, interval.end);
      } else {
        counter += 1;
        scoresMappedByStart
          .get(interval.start)
          ?.push({ name: team.teamName, score: interval.score });
      }
    });
  }

  scoresMappedByStart.forEach((value, key) => {
    teamIntervalChartData.push({
      start: key,
      end: endMappedByStart.get(key) as number,
      teamScores: value,
    });
  });

  teamIntervalChartData.sort((a, b) => a.start - b.start);
  const currentDate = Date.now();
  const threeMonthsAgo = currentDate - 7776000000;

  teamIntervalChartData = teamIntervalChartData.filter(
    (interval) => interval.start > threeMonthsAgo,
  );

  const chartData = teamIntervalChartData.map((interval) => {
    const teamParsedScores = new Map<string, number>();
    interval.teamScores.forEach((team) => {
      teamParsedScores.set(team.name, team.score);
    });
    const teamParsedScoresObject = Object.fromEntries(teamParsedScores);
    return {
      ...teamParsedScoresObject,
      start: interval.start,
      end: interval.end,
    };
  });

  return (
    <div className="">
      <div className=""></div>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>3 Month Engagement Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={chartData}>
              <XAxis
                dataKey="start"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                tick={true}
                axisLine={false}
                tickFormatter={(value) =>
                  `${new Date(value).toLocaleString([], { day: "numeric", month: "short", year: "numeric" })}`
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
              />

              {uniqueTeamNames.map((teamName) => {
                const teamIndex = teamNameToIndex.get(teamName);
                return (
                  <Area
                    type="monotone"
                    dataKey={`${teamName}`}
                    stroke={indexToColor(teamIndex!)}
                    fill={indexToColor(teamIndex!)}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
