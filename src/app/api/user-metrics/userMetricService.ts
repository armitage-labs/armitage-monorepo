import { UserTeamMetric } from "@prisma/client";
import prisma from "db";

export type UserMetric = {
  metricName: string;
  metricValue: number;
  metricMax: number;
  metricScore: number;
};

export async function fetchTeamUserMetrics(
  teamId: string,
  repoName: string
): Promise<UserTeamMetric[]> {
  console.log(repoName);
  const teamMetrics = await prisma.userTeamMetric.findMany({
    where: {
      repo_name: repoName,
      contribution_calculation: {
        Team: {
          id: teamId,
        },
      },
    },
  });
  return teamMetrics;
}

export async function feachMaxTeamMetrics(
  userTeamMetric: UserTeamMetric[]
): Promise<Map<string, UserTeamMetric>> {
  const hashmap = new Map<string, UserTeamMetric>();

  userTeamMetric.forEach((value) => {
    const currentMax = hashmap.get(value.metric_name);

    if (
      parseInt(currentMax?.metric_count ?? "0") < parseInt(value.metric_count)
    ) {
      hashmap.set(value.metric_name, value);
    }
  });
  return hashmap;
}

export async function feachUsersTeamMetrics(
  username: string,
  userTeamMetric: UserTeamMetric[]
): Promise<UserTeamMetric[]> {
  return userTeamMetric.filter((metric) => metric.username === username);
}

export async function feachUsersTeamRpgMetics(
  userTeamMetric: UserTeamMetric[],
  topUserMetric: Map<string, UserTeamMetric>
): Promise<UserMetric[]> {
  const value: UserMetric[] = userTeamMetric.map((metric) => ({
    metricName: metric.metric_name,
    metricValue: parseInt(metric.metric_count),
    metricMax: parseInt(
      topUserMetric.get(metric.metric_name)?.metric_count ?? metric.metric_count
    ),
    metricScore:
      (parseInt(metric.metric_count) /
        parseInt(
          topUserMetric.get(metric.metric_name)?.metric_count ??
            metric.metric_count
        )) *
      100,
  }));

  return value;
}
