import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalculationIntervalChartProps {
  intervals: any[];
}

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
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart width={500} height={400} data={intervals}>
              <XAxis
                dataKey="eTime"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${new Date(value).toDateString()}`}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#888888"
                fill="#888888"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
