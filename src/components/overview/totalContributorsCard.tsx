import { OverviewDto } from "@/app/api/teams/types/overview.dto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

interface TotalContributorsCardProps {
  overview?: OverviewDto;
}

export function TotalContributorsCard({
  overview,
}: TotalContributorsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total contributors
        </CardTitle>
        <Icons.users></Icons.users>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{overview?.totalContributors}</div>
        <p className="pt-1 text-xs text-muted-foreground">
          Contributors on team
        </p>
      </CardContent>
    </Card>
  );
}
