import { ContributorDto } from "@/app/api/contributors/fetchUserContributors";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ContributorsDataTable } from "../../contributors/contributorsDataTable";
import { contributorsColumns } from "../../contributors/contributorsColumns";

interface TeamContributionTableProps {
  teamId?: string;
}

export function TeamContributionTable({ teamId }: TeamContributionTableProps) {
  const { data: session } = useSession();
  const [contributors, setContributors] = useState<ContributorDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchUserContributors = async () => {
    const { data } = await axios.get(`/api/contributors?team_id=${teamId}`);
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
    <ContributorsDataTable
      columns={contributorsColumns}
      data={contributors}
      isLoading={isLoading}
    ></ContributorsDataTable>
  );
}
