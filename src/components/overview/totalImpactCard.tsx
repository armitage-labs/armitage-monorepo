import { OverviewDto } from "@/app/api/teams/types/overview.dto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { HoverExplainer } from "../hoverExplainer";

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
        <div className="flex justify-between">
          <p className="pt-1 text-xs text-muted-foreground">
            {overview?.weekGrowth ? (overview?.weekGrowth > 0 ? "+" : "-") : ""}{" "}
            {overview?.weekGrowth?.toFixed(2) || 0}% all time growth during last
            week
          </p>
          <HoverExplainer
            title="Understand how the current week compares to the total impact"
            description="The total impact is the sum of all the scores of the contributors in all your teams."
            subtitle="Calculated from the first activity of a team."
            imageSrc="https://cdn11.bigcommerce.com/s-hii7479o/images/stencil/original/products/13868/32254/pizza__85111.1568154248.png?c=2"
          />
        </div>
      </CardContent>
    </Card>
  );
}
