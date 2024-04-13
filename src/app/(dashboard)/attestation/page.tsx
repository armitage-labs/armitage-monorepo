"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AttestationDataTable } from "./attestationDataTable";
import { attestationColumns } from "./attestationColumns";
import { AttestationDto } from "@/app/api/attestations/service";
import axios from "axios";

export default function GitRepo() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [attestations, setAttestations] = useState<AttestationDto[]>([]);

  const handleFetchAttestation = async () => {
    const { data } = await axios.get("/api/attestations/details");
    console.log(data);
    if (data.success) {
      setAttestations(data.attestations);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (session?.userId) {
      handleFetchAttestation();
    }
  }, [session]);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <div className="flex items-start justify-between">
          <Heading
            title={`Attestations`}
            description={`See all your Attestations`}
          />
        </div>
        <Separator />

        <AttestationDataTable
          columns={attestationColumns}
          data={attestations}
          isLoading={isLoading}
        ></AttestationDataTable>
      </div>
    </>
  );
}
