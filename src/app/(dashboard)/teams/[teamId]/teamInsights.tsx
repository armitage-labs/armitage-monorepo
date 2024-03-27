import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewDto } from "@/app/api/teams/types/overview.dto";
import { HoverExplainer } from "@/components/hoverExplainer";

interface TeamInsightsProps {
  overview?: OverviewDto;
}

export function TeamInsights({ overview }: TeamInsightsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total impact
          </CardTitle>
          <Icons.lineChart></Icons.lineChart>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {overview?.totalScore.toFixed(2)}
          </div>
          <div className="flex justify-between">
            <p className="pt-1 text-xs text-muted-foreground">
              +{overview?.weekGrowth.toFixed(2)}% impact this week
            </p>
            <HoverExplainer
              title="How the current week compares to the total engagement and impact"
              description="The total engagement is the sum of all the scores of the contributors in your team"
              subtitle="Calculated from the first activity of a team."
              imageSrc="https://cdn11.bigcommerce.com/s-hii7479o/images/stencil/original/products/13868/32254/pizza__85111.1568154248.png?c=2"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Team engagement this week
          </CardTitle>
          <Icons.pizza></Icons.pizza>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {overview?.weekScore.toFixed(2)}
          </div>
          <div className="flex justify-between">
            <p className="pt-1 text-xs text-muted-foreground">
              {overview?.wowScore ? (overview?.wowScore > 0 ? "+" : "-") : ""}{" "}
              {overview?.wowScore.toFixed(2)}% over last week
            </p>
            <HoverExplainer
              title="How the current week compares to the previous week"
              description="The team engagement score of this week is the sum of all the scores of the contributors in your team"
              subtitle="Calculated on a rolling Sunday to Sunday basis"
              imageSrc="https://cdn-icons-png.flaticon.com/512/7172/7172779.png"
            />
          </div>
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
