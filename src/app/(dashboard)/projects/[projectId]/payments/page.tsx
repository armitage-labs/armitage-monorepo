"use client";

import { PaymentAddressDto } from "@/app/api/payments/service/paymentAddressService";
import PaymentsOnboarding from "@/components/payments/paymentsOnboarding";
import { Heading } from "@/components/ui/heading";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import { ContributorDto } from "@/app/api/contributors/fetchUserContributors";
import { SplitsDataTable } from "@/components/payments/splits/splitsDataTable";
import { SplitsColumns } from "@/components/payments/splits/splitsColumns";
import { useCreateSplit, useSplitsClient } from "@0xsplits/splits-sdk-react";
import { Button } from "@/components/ui/button";
import { Split, Wallet2 } from "lucide-react";
import { SplitsClient } from "@0xsplits/splits-sdk";
import { useChainId } from "wagmi";

interface PageProps {
  params: { projectId: string };
}

export default function ProjectPaymentsPage({ params }: PageProps) {
  const projectId = params.projectId;
  const [projectPaymentAddress, setProjectPaymentAddress] = useState<
    PaymentAddressDto | undefined
  >();
  const [contributors, setContributors] = useState<ContributorDto[]>([]);
  const splitsClient = useSplitsClient({
    chainId: 8453,
    publicClient: window.ethereum!,
  });

  // const splitsClient = new SplitsClient({
  //   chainId: 11155111,
  // });

  const handleFetchProjectPaymentAddress = async () => {
    const { data } = await axios.get("/api/payments?team_id=" + projectId);
    if (data.success && data.paymentAddress) {
      setProjectPaymentAddress(data.paymentAddress);
    }
  };

  const handleFetchUserContributors = async () => {
    const { data } = await axios.get(
      `/api/payments/splits?team_id=${projectId}`,
    );
    if (data.success) {
      setContributors(data.contributors);
    }
  };

  useEffect(() => {
    handleFetchProjectPaymentAddress();
    handleFetchUserContributors();
    handleFetchMetadata();
  }, []);

  const handleFetchMetadata = async () => {
    const args = {
      splitAddress: "0x881985d5B0690598b84bcD7348c4A8c842e79419",
    };
    const response = await splitsClient.getSplitMetadata(args);
    console.log(response);

    // console.log(response);
  };

  return (
    <>
      {projectPaymentAddress != null ? (
        <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
          <div className="flex items-start">
            <Heading title={`Payment Address`} description="" />
            <div className="flex items-start">
              <div className="text-left pl-20">
                <p className="text-xl text-muted-foreground">Network</p>
                <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Sepolia
                </h4>
              </div>

              <div className="text-left pl-10">
                <p className="text-xl text-muted-foreground">Address</p>
                <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  {projectPaymentAddress.wallet_address}
                </h4>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Wallet2 className="inline-block" />
                    <CardTitle className="inline-block ml-2">Balance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <div className="text-6xl font-bold">$0.00</div>
                  </div>
                  <div className="border-t border-gray-300 mt-3 mb-3"></div>
                  <div className="flex justify-center">
                    <p className="text-xl text-muted-foreground">
                      No ETH or ERC-20
                    </p>
                  </div>
                  <div className="border-t border-gray-300 mt-3 mb-3"></div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full text-md flex justify-between items-center"
                    onClick={() => console.log()}
                  >
                    Distribute Balances
                    <Split className="mr-2 h-5 w-5 transform rotate-90" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <CardTitle className="inline-block ml-2">
                      Distribute Splits
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <SplitsDataTable
                    columns={SplitsColumns}
                    data={contributors}
                    isLoading={false}
                  ></SplitsDataTable>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <PaymentsOnboarding projectId={projectId}></PaymentsOnboarding>
      )}
    </>
  );
}
