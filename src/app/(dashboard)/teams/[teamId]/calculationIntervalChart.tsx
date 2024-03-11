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
        <p className="label">{`${new Date(label).toLocaleString([], { day: "numeric", month: "short", year: "numeric" })} : ${payload[0].value}`}</p>
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
          <CardTitle>Overview</CardTitle>
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
