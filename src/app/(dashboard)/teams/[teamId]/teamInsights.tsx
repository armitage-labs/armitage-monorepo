import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewDto } from "@/app/api/teams/types/overview.dto";

interface TeamInsightsProps {
  overview?: OverviewDto;
}

export function TeamInsights({ overview }: TeamInsightsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total team impact
          </CardTitle>
          <Icons.lineChart></Icons.lineChart>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {overview?.totalScore?.toFixed(2) || 0}
          </div>
          <p className="pt-1 text-xs text-muted-foreground">
            +{overview?.weekGrowth?.toFixed(2) || 0}% CRED earned
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Team impact earned week
          </CardTitle>
          <Icons.pizza></Icons.pizza>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {overview?.weekScore?.toFixed(2) || 0}
          </div>
          <p className="pt-1 text-xs text-muted-foreground">
            {overview?.wowScore?.toFixed(2) || 0}% over last week
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total contributors
          </CardTitle>
          <Icons.users></Icons.users>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {overview?.totalContributors}
          </div>
          <p className="pt-1 text-xs text-muted-foreground">
            Contributors on team
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
