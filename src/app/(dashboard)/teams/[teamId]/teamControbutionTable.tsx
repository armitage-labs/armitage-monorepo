import { ContributorDto } from "@/app/api/contributors/fetchUserContributors";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ContributorsDataTable } from "../../contributors/contributorsDataTable";
import { contributorsColumns } from "../../contributors/contributorsColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeamControbutionTableProps {
  teamId?: string;
}

export function TeamControbutionTable({ teamId }: TeamControbutionTableProps) {
  const { data: session } = useSession();
  const [contributors, setContributors] = useState<ContributorDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchUserContributors = async () => {
    const { data } = await axios.get(`/api/contributors?teamId=${teamId}`);
    if (data.success) {
      setContributors(data.contributors);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.userId) {
      handleFetchUserContributors();
    }
  }, [session]);

  return (
    <>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Contributors</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ContributorsDataTable
            columns={contributorsColumns}
            data={contributors}
            isLoading={isLoading}
          ></ContributorsDataTable>
        </CardContent>
      </Card>
    </>
  );
}
