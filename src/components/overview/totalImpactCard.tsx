import { OverviewDto } from "@/app/api/teams/types/overview.dto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

interface TotalImpactCardProps {
  overview?: OverviewDto;
}

export function TotalImpactCard({ overview }: TotalImpactCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total impact</CardTitle>
        <Icons.pizza></Icons.pizza>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {overview?.totalScore?.toFixed(2) || 0}
        </div>
        <p className="pt-1 text-xs text-muted-foreground">
          {overview?.weekGrowth ? (overview?.weekGrowth > 0 ? "+" : "-") : ""}{" "}
          {overview?.weekGrowth?.toFixed(2) || 0}% all time growth during last
          week
        </p>
      </CardContent>
    </Card>
  );
}
