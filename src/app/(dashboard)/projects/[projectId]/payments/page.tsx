"use client"

import { PaymentAddressDto } from "@/app/api/payment-address/service/paymentAddress";
import PaymentsOnboarding from "@/components/onboarding/onboardingTutorial";
import axios from "axios";
import { useState } from "react";

interface PageProps {
  params: { projectId: string };
}

export default function ProjectPaymentsPage({ params }: PageProps) {
  const teamId = params.projectId;
  const breadcrumbItems = [
    { title: "Projects", link: "/projects" },
    { title: "Project details", link: `/projects/${teamId}` },
    { title: "Project Payments", link: `/projects/${teamId}/payments` },
  ];
  const [projectPaymentAddress, setProjectPaymentAddress] = useState<PaymentAddressDto | undefined>();

  const handleFetchProjectPaymentAddress = async () => {
    const { data } = await axios.get("/api/payment-address?team_id=" + teamId);
    if (data.success && data.paymentAddress) {
      setProjectPaymentAddress(data.paymentAddress);
    }
  }

  return (
    <>
      <PaymentsOnboarding></PaymentsOnboarding>
    </>
  );
}
