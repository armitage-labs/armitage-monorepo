import { UserCredDto } from "@/app/api/credmanager/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CalculationResultProps {
  userCredDtoList: UserCredDto[];
}

export function CalculationResult({ userCredDtoList }: CalculationResultProps) {
  return (
    <div className="">
      <div className=""></div>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={userCredDtoList}>
              <XAxis
                dataKey="userName"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip></Tooltip>
              <Bar dataKey="totalCred" fill="#adfa1d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
