"use client";

import { PaymentAddressDto } from "@/app/api/payments/service/paymentAddressService";
import PaymentsOnboarding from "@/components/payments/paymentsOnboarding";
import { SplitsProvider } from "@0xsplits/splits-sdk-react";
import axios from "axios";
import { useState } from "react";

interface PageProps {
  params: { projectId: string };
}

export default function ProjectPaymentsPage({ params }: PageProps) {
  const projectId = params.projectId;
  const [projectPaymentAddress, setProjectPaymentAddress] = useState<
    PaymentAddressDto | undefined
  >();

  const handleFetchProjectPaymentAddress = async () => {
    const { data } = await axios.get("/api/payments?team_id=" + projectId);
    if (data.success && data.paymentAddress) {
      setProjectPaymentAddress(data.paymentAddress);
    }
  };

  return (
    <>
      {projectPaymentAddress != null ? (
        <>WIP: Payment coming soon</>
      ) : (
        <PaymentsOnboarding projectId={projectId}></PaymentsOnboarding>
      )}
    </>
  );
}
