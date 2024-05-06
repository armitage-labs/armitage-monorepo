import { ContributorDto } from "@/app/api/contributors/fetchUserContributors";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ProjectContributorsDataTable } from "./contributorsDataTable";
import { ProjectContributorsColumns } from "./contributorsColumns";
import { Heading } from "@/components/ui/heading";

interface ProjectContributionTableProps {
  projectId: string;
}

export default function ContributorsTable({
  projectId,
}: ProjectContributionTableProps) {
  const { data: session } = useSession();
  const [contributors, setContributors] = useState<ContributorDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchUserContributors = async () => {
    const { data } = await axios.get(
      `/api/contributors/payments?team_id=${projectId}`,
    );
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
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <div className="flex items-start justify-between">
        <Heading
          title={`Contributors (${contributors.length})`}
          description={`Choose your players!`}
        />
      </div>

      <ProjectContributorsDataTable
        columns={ProjectContributorsColumns}
        data={contributors}
        isLoading={isLoading}
      ></ProjectContributorsDataTable>
    </div>
  );
}
