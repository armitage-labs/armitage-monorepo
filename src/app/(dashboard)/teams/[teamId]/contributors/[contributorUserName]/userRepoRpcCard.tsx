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

interface UserRepoRpcCardProps {
  teamId: string;
  repoName: string;
  contributorUserName: string;
}

export default function UserRepoRpcCard({
  teamId,
  repoName,
  contributorUserName,
}: UserRepoRpcCardProps) {
  const [userMetric, setUserMetric] = useState<UserMetric[]>();

  const handleUserMetrics = async () => {
    const { data } = await axios.get(
      `/api/user-metrics?username=${contributorUserName}&team_id=${teamId}&repo_name=${repoName}`,
    );
    if (data.success) {
      setUserMetric(data.metrics);
    }
  };

  useEffect(() => {
    handleUserMetrics();
  }, []);

  return (
    <>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>
            <div className="flex">
              {repoName}
              <Icons.gitHub className="ml-3 h-5 w-5" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div />
            {userMetric == null ? (
              <Skeleton className="h-10 w-[520px]" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart outerRadius="70%" data={userMetric}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metricName" />
                  <Radar
                    dataKey="metricScore"
                    stroke="#84CC16"
                    fill="#84CC16"
                    fillOpacity={0.95}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
