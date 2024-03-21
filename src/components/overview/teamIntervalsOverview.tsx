import {
  XAxis,
  Tooltip,
  TooltipProps,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Interval } from "@/app/api/teams/overview/intervals/types";
import { Badge } from "../ui/badge";
import {
  TeamIntervalsChartData,
  TeamIntervalsOverviewProps,
  TeamUtils,
} from "./types";
import { indexToColor } from "./utils";

const CustomTooltip = ({
  active,
  payload,
  teamNameToIndex,
}: TooltipProps<ValueType, NameType> & TeamUtils) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        {payload.map((data) => {
          return (
            <div>
              <Badge>
                <span
                  className={`pl-4 h-4 w-4 rounded-full `}
                  style={{
                    backgroundColor: `${indexToColor(teamNameToIndex.get(data.dataKey!.toString())!)}`,
                  }}
                ></span>
                <div className="pl-2">
                  {`${data.dataKey}: ${parseFloat(data.value!.toString()).toPrecision(3)}`}
                </div>
              </Badge>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

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
  const teamIntervalChartData: TeamIntervalsChartData[] = [];
  const scoresMappedByStart = new Map<
    number,
    { name: string; score: number }[]
  >();
  const endMappedByStart = new Map<number, number>();
  const uniqueStarts: number[] = [];
  let counter = 0;
  for (const team of teamIntervalsOverview) {
    team.intervals.forEach((interval: Interval) => {
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
            <LineChart data={chartData}>
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
                content={<CustomTooltip teamNameToIndex={teamNameToIndex} />}
                cursor={{ fill: "transparent" }}
              />

              {uniqueTeamNames.map((teamName) => {
                const teamIndex = teamNameToIndex.get(teamName);
                return (
                  <Line
                    type="monotone"
                    dataKey={`${teamName}`}
                    stroke={indexToColor(teamIndex!)}
                    fill={indexToColor(teamIndex!)}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
