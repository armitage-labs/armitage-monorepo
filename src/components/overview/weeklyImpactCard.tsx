import { OverviewDto } from "@/app/api/teams/types/overview.dto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

interface WeeklyImpactCardProps {
  overview?: OverviewDto;
}

export function WeeklyImpactCard({ overview }: WeeklyImpactCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Impact this week</CardTitle>
        <Icons.gitBranch></Icons.gitBranch>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {overview?.weekScore?.toFixed(2) || 0}
        </div>
        <p className="pt-1 text-xs text-muted-foreground">
          {overview?.wowScore ? (overview?.wowScore > 0 ? "+" : "") : ""}{" "}
          {overview?.wowScore?.toFixed(2) || 0}% compared to last week
        </p>
      </CardContent>
    </Card>
  );
}
