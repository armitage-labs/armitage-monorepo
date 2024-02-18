import { UserCredDto } from "@/app/api/credmanager/route";
import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

interface CalculationResultProps {
  userCredDtoList: UserCredDto[];
}

export function CalculationResult({ userCredDtoList }: CalculationResultProps) {
  return (
    <div className="p-4 pb-0">
      <div className="flex items-center"></div>
      <div className="pt-16 mt-3 h-[420px] w-[800px]">
        <ResponsiveContainer>
          <BarChart
            data={userCredDtoList}
            barGap="10%"
            barCategoryGap="10%"
            height={420}
            width={800}
            margin={{
              top: 5,
              right: 50,
              left: 50,
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="userName"
              scale="point"
              padding={{ left: 10, right: 10 }}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip></Tooltip>
            <Bar
              name="totalCred"
              dataKey="totalCred"
              style={
                {
                  fill: "hsl(var(--foreground))",
                  opacity: 0.9,
                } as React.CSSProperties
              }
            ></Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
