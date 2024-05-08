"use client";

import { PaymentAddressDto } from "@/app/api/payments/service/paymentAddressService";
import PaymentsOnboarding from "@/components/payments/paymentsOnboarding";
import axios from "axios";
import { useEffect, useState } from "react";
import PaymentsView from "@/components/payments/paymentView";


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

  useEffect(() => {
    handleFetchProjectPaymentAddress();
  }, []);

  return (
    <>
      {projectPaymentAddress != null ? (
        <PaymentsView
          projectId={projectId}
          paymentAddress={projectPaymentAddress}
        ></PaymentsView>
      ) : (
        <PaymentsOnboarding projectId={projectId}></PaymentsOnboarding>
      )}
    </>
  );
}
