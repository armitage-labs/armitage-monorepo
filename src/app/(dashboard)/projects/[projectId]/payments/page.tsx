"use client";

import PaymentsOnboarding from "@/components/payments/paymentsOnboarding";
import axios from "axios";
import { useEffect, useState } from "react";
import PaymentsView from "@/components/payments/paymentView";
import { PaymentAddressDto } from "@/app/api/payments/route";
import { LoadingCircle } from "@/components/navigation/loading";

interface PageProps {
  params: { projectId: string };
}

export default function ProjectPaymentsPage({ params }: PageProps) {
  const projectId = params.projectId;
  const [isLoading, setIsLoading] = useState(true);
  const [projectPaymentAddress, setProjectPaymentAddress] = useState<
    PaymentAddressDto | undefined
  >();

  const handleFetchProjectPaymentAddress = async () => {
    const { data } = await axios.get("/api/payments?team_id=" + projectId);
    if (data.success && data.paymentAddress) {
      setProjectPaymentAddress(data.paymentAddress);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleFetchProjectPaymentAddress();
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <div className="pt-36 flex justify-center">
            <LoadingCircle></LoadingCircle>
          </div>
        </>
      ) : (
        <>
          {projectPaymentAddress != null ? (
            <PaymentsView
              projectId={projectId}
              paymentAddress={projectPaymentAddress}
            ></PaymentsView>
          ) : (
            <PaymentsOnboarding
              projectId={projectId}
              onCreate={setProjectPaymentAddress}
            ></PaymentsOnboarding>
          )}
        </>
      )}
    </>
  );
}
