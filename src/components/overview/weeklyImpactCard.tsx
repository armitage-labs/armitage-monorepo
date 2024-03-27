import { OverviewDto } from "@/app/api/teams/types/overview.dto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { HoverExplainer } from "../hoverExplainer";

interface WeeklyImpactCardProps {
  overview?: OverviewDto;
}

export function WeeklyImpactCard({ overview }: WeeklyImpactCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Engagement this week
        </CardTitle>
        <Icons.gitBranch></Icons.gitBranch>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {overview?.weekScore?.toFixed(2) || 0}
        </div>
        <div className="flex justify-between">
          <p className="pt-1 text-xs text-muted-foreground">
            {overview?.wowScore ? (overview?.wowScore > 0 ? "+" : "") : ""}{" "}
            {overview?.wowScore?.toFixed(2) || 0}% compared to last week
          </p>
          <HoverExplainer
            title="Understand how the current week compares to the previous week"
            description="The weekely engagement is the sum of all the scores of the contributors in all your teams during the current week."
            subtitle="Calculated from Sunday to Sunday."
            imageSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Git_icon.svg/2048px-Git_icon.svg.png"
          />
        </div>
      </CardContent>
    </Card>
  );
}
