import { UserCredDto } from "@/app/api/credmanager/route";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import * as React from "react";
import {
  Bar,
  BarChart,
  TooltipProps,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";

interface CalculationResultProps {
  userCredDtoList: UserCredDto[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <Badge>{`${label}: ${parseFloat(payload[0].value!.toString()).toPrecision(3)}`}</Badge>
      </div>
    );
  }

  return null;
};

export function CalculationResult({ userCredDtoList }: CalculationResultProps) {
  return (
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
        <Bar dataKey="totalCred" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
