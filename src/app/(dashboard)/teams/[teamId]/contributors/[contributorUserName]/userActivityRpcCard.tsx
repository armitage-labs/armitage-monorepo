import { UserMetric } from "@/app/api/user-metrics/userMetricService";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";

interface UserActivityRpcCardProps {
  teamId: string;
  contributorUserName: string;
}

export default function UserActivityRpcCard({
  teamId,
  contributorUserName,
}: UserActivityRpcCardProps) {
  const [userMetric, setUserMetric] = useState<UserMetric[]>();
  const [userMetricLeaderboard, setUserMetricLeaderboard] =
    useState<UserMetric[]>();

  const parseMetricName = (metricName: string): string => {
    if (metricName === "PullRequestReviewComment") {
      return "PR Comments";
    }
    if (metricName === "PullRequestReview") {
      return "PR Reviews";
    }
    if (metricName === "PullRequest") {
      return "PRs";
    }
    if (metricName === "IssueComment") {
      return "Comments";
    }
    return metricName;
  };

  const parseRankValue = (rank?: number): string => {
    if (rank === 0) {
      return "🥇 1st place";
    } else if (rank === 1) {
      return "🥈 2nd place";
    } else if (rank === 2) {
      return "🥉 3rd place";
    } else {
      if (rank) {
        return `Rank number ${rank + 1}`;
      }
      return "Rank not available";
    }
  };

  const parseMetrics = (metrics: UserMetric[]): UserMetric[] => {
    const parsedMetrics = metrics.map((metric) => {
      if (metric.metricName === "IssueComment") {
        const prComments = metrics.find(
          (metric) => metric.metricName === "PullRequestReviewComment",
        );
        if (prComments) {
          return {
            ...metric,
            metricName: parseMetricName(metric.metricName),
            metricValue: metric.metricValue + prComments?.metricValue,
          };
        }
      }
      return {
        ...metric,
        metricName: parseMetricName(metric.metricName),
      };
    });
    return parsedMetrics;
  };

  const handleUserMertricsLeaderboard = async () => {
    const { data } = await axios.get(
      `/api/user-metrics/teams/leaderboard?username=${contributorUserName}&team_id=${teamId}`,
    );
    if (data.success) {
      console.log("LEADERBOARD:");
      console.log(data.metrics);
      const unparsedMetrics: UserMetric[] = data.metrics;
      const parsedMetrics = parseMetrics(unparsedMetrics);
      setUserMetricLeaderboard(parsedMetrics);
    }
  };

  const handleUserMetrics = async () => {
    const { data } = await axios.get(
      `/api/user-metrics/teams/activity?username=${contributorUserName}&team_id=${teamId}`,
    );
    if (data.success) {
      const unparsedMetrics: UserMetric[] = data.metrics;
      const parsedMetrics = parseMetrics(unparsedMetrics);
      console.log("PARSED:");
      console.log(parsedMetrics);
      setUserMetric(parsedMetrics);
    }
  };

  useEffect(() => {
    handleUserMetrics();
    handleUserMertricsLeaderboard();
  }, []);

  return (
    <>
      <div>
        <Card className="col-span-2 bg-gradient-to-br from-gray-950">
          <CardHeader>
            <CardTitle>
              <div className="flex ">
                <Icons.gitHub className="h-6 pr-3"></Icons.gitHub>
                {contributorUserName} Activity
              </div>
            </CardTitle>
          </CardHeader>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <CardContent className="pl-2">
              <div className="grid grid-cols-1 gap-4">
                {userMetric == null ? (
                  <Skeleton className="h-[400px] w-[520px]" />
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart
                      outerRadius="70%"
                      data={userMetric.filter(
                        (metric: UserMetric) =>
                          metric.metricName != "Commit" &&
                          metric.metricName != "PR Comments",
                      )}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metricName" />
                      <Radar
                        dataKey="metricValue"
                        stroke="#84CC16"
                        fill="#84CC16"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>

            <CardContent className="pl-2">
              <div className="grid grid-cols-1 gap-4">
                {userMetric == null || userMetricLeaderboard == null ? (
                  <Skeleton className="h-[400px] w-[520px]" />
                ) : (
                  <div className="justify-items-end">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 pb-20">
                      <div>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Commits
                            </CardTitle>
                            <Icons.gitCommit></Icons.gitCommit>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {
                                userMetricLeaderboard.find(
                                  (metric: UserMetric) =>
                                    metric.metricName === "Commit",
                                )?.metricValue
                              }
                            </div>
                            <div className="flex justify-between">
                              <p className="pt-1 text-xs text-muted-foreground">
                                {parseRankValue(
                                  userMetricLeaderboard.find(
                                    (metric: UserMetric) =>
                                      metric.metricName === "Commit",
                                  )?.rank,
                                )}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Pull Requests
                            </CardTitle>
                            <Icons.gitPullRequestArrow></Icons.gitPullRequestArrow>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {
                                userMetricLeaderboard.find(
                                  (metric: UserMetric) =>
                                    metric.metricName === "PRs",
                                )?.metricValue
                              }
                            </div>
                            <div className="flex justify-between">
                              <p className="pt-1 text-xs text-muted-foreground">
                                {parseRankValue(
                                  userMetricLeaderboard.find(
                                    (metric: UserMetric) =>
                                      metric.metricName === "PRs",
                                  )?.rank,
                                )}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Reviews
                            </CardTitle>
                            <Icons.bookUser></Icons.bookUser>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {
                                userMetricLeaderboard.find(
                                  (metric: UserMetric) =>
                                    metric.metricName === "PR Reviews",
                                )?.metricValue
                              }
                            </div>
                            <div className="flex justify-between">
                              <p className="pt-1 text-xs text-muted-foreground">
                                {parseRankValue(
                                  userMetricLeaderboard.find(
                                    (metric: UserMetric) =>
                                      metric.metricName === "PR Reviews",
                                  )?.rank,
                                )}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            Issues
                          </CardTitle>
                          <Icons.gitCompare></Icons.gitCompare>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {
                              userMetricLeaderboard.find(
                                (metric: UserMetric) =>
                                  metric.metricName === "Issue",
                              )?.metricValue
                            }
                          </div>
                          <div className="flex justify-between">
                            <p className="pt-1 text-xs text-muted-foreground">
                              {parseRankValue(
                                userMetricLeaderboard.find(
                                  (metric: UserMetric) =>
                                    metric.metricName === "Issue",
                                )?.rank,
                              )}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <div>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Comments
                            </CardTitle>
                            <Icons.messagesSquare></Icons.messagesSquare>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {
                                userMetricLeaderboard.find(
                                  (metric: UserMetric) =>
                                    metric.metricName === "Comments",
                                )?.metricValue
                              }
                            </div>
                            <div className="flex justify-between">
                              <p className="pt-1 text-xs text-muted-foreground">
                                {parseRankValue(
                                  userMetricLeaderboard.find(
                                    (metric: UserMetric) =>
                                      metric.metricName === "Comments",
                                  )?.rank,
                                )}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Reactions
                            </CardTitle>
                            <Icons.thumbsUp></Icons.thumbsUp>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {
                                userMetricLeaderboard.find(
                                  (metric: UserMetric) =>
                                    metric.metricName === "Reaction",
                                )?.metricValue
                              }
                            </div>
                            <div className="flex justify-between">
                              <p className="pt-1 text-xs text-muted-foreground">
                                {parseRankValue(
                                  userMetricLeaderboard.find(
                                    (metric: UserMetric) =>
                                      metric.metricName === "Reaction",
                                  )?.rank,
                                )}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </>
  );
}
