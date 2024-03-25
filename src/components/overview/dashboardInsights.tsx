import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewDto } from "@/app/api/teams/types/overview.dto";

interface DashboardInsightsProps {
  overview?: OverviewDto;
}

export function DashboardInsights({ overview }: DashboardInsightsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total impact</CardTitle>
          <Icons.pizza></Icons.pizza>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {overview?.totalScore.toFixed(2)}
          </div>
          <p className="pt-1 text-xs text-muted-foreground">
            {overview?.weekGrowth ? (overview?.weekGrowth > 0 ? "+" : "-") : ""}{" "}
            {overview?.weekGrowth.toFixed(2)}% all time growth during last week
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Impact this week
          </CardTitle>
          <Icons.gitBranch></Icons.gitBranch>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {overview?.weekScore.toFixed(2)}
          </div>
          <p className="pt-1 text-xs text-muted-foreground">
            {overview?.wowScore ? (overview?.wowScore > 0 ? "+" : "-") : ""}{" "}
            {overview?.wowScore.toFixed(2)}% compared to last week
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
