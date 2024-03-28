import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  TooltipProps,
  ResponsiveContainer,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HoverExplainer } from "@/components/hoverExplainer";

interface CalculationIntervalChartProps {
  intervals: any[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <Badge>{`${new Date(label).toLocaleString([], { day: "numeric", month: "short", year: "numeric" })} : ${parseFloat(payload[0].value!.toString()).toPrecision(3)}`}</Badge>
      </div>
    );
  }

  return null;
};

export function CalculationIntervalChart({
  intervals,
}: CalculationIntervalChartProps) {
  return (
    <div className="">
      <div className=""></div>
      <Card className="col-span-2">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Overview</CardTitle>
            <HoverExplainer
              title="Understand the most engaged periods of your team."
              description="This chart can help you understand the most engaged periods of your team. The x-axis represents the time and the y-axis represents the engagement score."
              subtitle="Rolling week basis"
              imageSrc="https://www.svgrepo.com/download/311488/activity.svg"
            />
          </div>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={intervals}>
              <XAxis
                dataKey="eTime"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `${new Date(value).toLocaleString([], { day: "numeric", month: "short", year: "numeric" })}`
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#adfa1d"
                fill="#adfa1d"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
