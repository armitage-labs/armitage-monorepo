"use client";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Circles } from "react-loader-spinner";

interface VerifyAttestationPage {
  params: { attestationUuid: string };
}

export default function VerifyAttestationPage({
  params,
}: VerifyAttestationPage) {
  const [isAttestationVerified, setIsAttestationVerified] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (params.attestationUuid) {
      handleVerifyAttestation();
    }
  }, []);

  const handleVerifyAttestation = async () => {
    const { data } = await axios.get(
      `/api/attestations/verify?uuid=${params.attestationUuid}`,
    );
    setIsAttestationVerified(data.valid);
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {isLoading ? (
        <div className="flex pt-40 justify-center items-center">
          <Circles color="white" />
        </div>
      ) : (
        <div className="w-max">
          <div className="relative flex items-center justify-center ">
            <Icons.armitageWhite className="mr-2 w-20 items-cente mb-4" />
            Attestation by Armitage
          </div>

          <Card>
            <CardContent className="text-center pt-12">
              <div className="flex flex-col items-center justify-center mb-10">
                <Image
                  src={"https://sepolia.easscan.org/logo2.png?v=3"}
                  width={100}
                  height={100}
                  alt={`easscan`}
                  priority={true}
                />

                {isAttestationVerified ? (
                  <div className="pb-12 pt-4 flex items-center">
                    <Badge className="bg-green-500">
                      <Icons.check className="w-6 h-6 mr-2" />
                      <span>Verified</span>
                    </Badge>
                  </div>
                ) : (
                  <div className="pb-12 pt-4 flex items-center">
                    <Badge className="bg-red-500">
                      <Icons.close className="w-6 h-6 mr-2" />
                      <span>Invalid</span>
                    </Badge>
                  </div>
                )}
                <span>
                  This attestation has been created by Armitage using EAS.
                </span>

                <br />
                <span>
                  Verify contribution scores while preserving <br />
                  intellectual property and other contributors identities.
                </span>

                <div>
                  <Button className="mt-10" asChild variant="secondary">
                    <Link
                      href={`https://sepolia.easscan.org/attestation/view/${params.attestationUuid}`}
                    >
                      See this attestation on EAS
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
