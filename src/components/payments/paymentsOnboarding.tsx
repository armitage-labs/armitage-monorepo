import { useState } from "react";
import OnboardingTutorial from "./onboardingTutorial";
import PaymentSplitsTable from "./contributors/paymentSplitsTable";
import { PaymentAddressDto } from "@/app/api/payments/route";

interface PaymentsOnboardingProps {
  projectId: string;
  onCreate: (param: PaymentAddressDto) => void;
}

export default function PaymentsOnboarding({
  projectId,
  onCreate,
}: PaymentsOnboardingProps) {
  const [onboardingTutorialCompleted, setOnboardingTutorialCompleted] =
    useState(false);

  return (
    <>
      {!onboardingTutorialCompleted ? (
        <OnboardingTutorial
          onTutorialCompleted={setOnboardingTutorialCompleted}
        ></OnboardingTutorial>
      ) : (
        <PaymentSplitsTable
          projectId={projectId}
          onCreate={onCreate}
        ></PaymentSplitsTable>
      )}
    </>
  );
}
