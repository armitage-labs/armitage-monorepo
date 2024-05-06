"use client";

import { PaymentAddressDto } from "@/app/api/payment-address/service/paymentAddress";
import PaymentsOnboarding from "@/components/payments/paymentsOnboarding";
import axios from "axios";
import { useState } from "react";

interface PageProps {
  params: { projectId: string };
}

export default function ProjectPaymentsPage({ params }: PageProps) {
  const projectId = params.projectId;
  const breadcrumbItems = [
    { title: "Projects", link: "/projects" },
    { title: "Project details", link: `/projects/${projectId}` },
    { title: "Project Payments", link: `/projects/${projectId}/payments` },
  ];
  const [projectPaymentAddress, setProjectPaymentAddress] = useState<
    PaymentAddressDto | undefined
  >();

  const handleFetchProjectPaymentAddress = async () => {
    const { data } = await axios.get(
      "/api/payment-address?team_id=" + projectId,
    );
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
