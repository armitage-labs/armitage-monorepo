import { OverviewDto } from "@/app/api/teams/types/overview.dto";
import { CardSkeleton } from "../skeleton/cardSkeleton";
import { TotalContributorsCard } from "./totalContributorsCard";
import { WeeklyImpactCard } from "./weeklyImpactCard";
import { TotalImpactCard } from "./totalImpactCard";

interface DashboardInsightsProps {
  overview?: OverviewDto;
}

export function DashboardInsights({ overview }: DashboardInsightsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {overview?.totalScore == null ? (
        <CardSkeleton></CardSkeleton>
      ) : (
        <TotalImpactCard overview={overview}></TotalImpactCard>
      )}

      {overview?.weekScore == null ? (
        <CardSkeleton></CardSkeleton>
      ) : (
        <WeeklyImpactCard overview={overview}></WeeklyImpactCard>
      )}

      {overview?.totalContributors == null ? (
        <CardSkeleton></CardSkeleton>
      ) : (
        <TotalContributorsCard overview={overview}></TotalContributorsCard>
      )}
    </div>
  );
}
