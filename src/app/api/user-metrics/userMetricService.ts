import { UserTeamMetric } from "@prisma/client";
import prisma from "db";

export type UserMetric = {
  metricName: string;
  metricValue: number;
  metricMax: number;
  metricScore: number;
  rank?: number;
};

export type UserMetricSum = {
  metricName: string;
  metricValue: number;
};

export async function fetchTeamUserMetrics(
  teamId: string,
): Promise<UserTeamMetric[]> {
  const teamMetrics = await prisma.userTeamMetric.findMany({
    where: {
      contribution_calculation: {
        Team: {
          id: teamId,
        },
      },
    },
  });
  return teamMetrics;
}

export async function fetchTeamUserMetricsByUsername(
  teamId: string,
  username: string,
): Promise<UserTeamMetric[]> {
  const teamMetrics = await prisma.userTeamMetric.findMany({
    where: {
      username: username,
      contribution_calculation: {
        Team: {
          id: teamId,
        },
      },
    },
  });
  return teamMetrics;
}

export async function fetchTeamUserMetricsByRepo(
  teamId: string,
  repoName: string,
): Promise<UserTeamMetric[]> {
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
  userTeamMetric: UserTeamMetric[],
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

export async function sumUsersTeamMetrics(
  userTeamMetric: UserTeamMetric[],
): Promise<UserMetricSum[]> {
  const mergedMetricsMap: { [key: string]: UserMetricSum } = {};

  // Merge objects on metric_name by summing the metric_count
  for (const metric of userTeamMetric) {
    if (mergedMetricsMap.hasOwnProperty(metric.metric_name)) {
      mergedMetricsMap[metric.metric_name].metricValue += parseInt(
        metric.metric_count,
      );
    } else {
      mergedMetricsMap[metric.metric_name] = {
        metricName: metric.metric_name,
        metricValue: parseInt(metric.metric_count),
      }; // Create a copy of the metric object
    }
  }
  // Convert the mergedMetricsMap back to an array
  const mergedMetrics: UserMetricSum[] = Object.values(mergedMetricsMap);
  return mergedMetrics;
}

export async function activityUserMetrics(
  userTeamMetric: UserMetricSum[],
): Promise<UserMetric[]> {
  const maxCount = userTeamMetric.reduce(
    (acc, metric) => acc + metric.metricValue,
    0,
  );

  return userTeamMetric.map((metric) => ({
    metricName: metric.metricName,
    metricValue: metric.metricValue,
    metricMax: maxCount,
    metricScore: (metric.metricValue / maxCount) * 100,
  }));
}

export async function feachUsersTeamMetrics(
  username: string,
  userTeamMetric: UserTeamMetric[],
): Promise<UserTeamMetric[]> {
  return userTeamMetric.filter((metric) => metric.username === username);
}

export async function feachUsersTeamRpgMetics(
  username: string,
  userTeamMetric: UserTeamMetric[],
  topUserMetric: Map<string, UserTeamMetric>,
  teamUserMetrics: UserTeamMetric[],
): Promise<UserMetric[]> {
  const metricsRanked = splitAndRankMetrics(teamUserMetrics);
  const value: UserMetric[] = userTeamMetric.map((metric) => ({
    metricName: metric.metric_name,
    metricValue: parseInt(metric.metric_count),
    metricMax: parseInt(
      topUserMetric.get(metric.metric_name)?.metric_count ??
        metric.metric_count,
    ),
    rank: getUserRank(username, metric.metric_name, metricsRanked),
    metricScore:
      (parseInt(metric.metric_count) /
        parseInt(
          topUserMetric.get(metric.metric_name)?.metric_count ??
            metric.metric_count,
        )) *
      100,
  }));

  return value;
}

function splitAndRankMetrics(
  teamUserMetrics: UserTeamMetric[],
): Map<string, UserTeamMetric[]> {
  const splitMap: Map<string, UserTeamMetric[]> = new Map<
    string,
    UserTeamMetric[]
  >();

  // Splitting the array based on metric_name
  teamUserMetrics.forEach((obj) => {
    const key = obj.metric_name;
    if (!splitMap.has(key)) {
      splitMap.set(key, []);
    }
    splitMap.get(key)?.push(obj);
  });

  // Sorting each group by metric_count
  splitMap.forEach((value, key) => {
    value.sort((a, b) => parseInt(b.metric_count) - parseInt(a.metric_count));
  });

  return splitMap;
}

function getUserRank(
  username: string,
  merticName: string,
  teamUserMetrics: Map<string, UserTeamMetric[]>,
) {
  const group = teamUserMetrics.get(merticName);
  if (group) {
    for (let i = 0; i < group.length; i++) {
      if (group[i].username === username) {
        return i;
      }
    }
  }
  return -1; // Return -1 if object not found
}
