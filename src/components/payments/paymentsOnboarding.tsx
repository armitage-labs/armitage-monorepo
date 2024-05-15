import { useState } from "react";
import OnboardingTutorial from "./onboardingTutorial";
import PaymentSplitsTable from "./contributors/paymentSplitsTable";

interface PaymentsOnboardingProps {
  projectId: string;
}

export default function PaymentsOnboarding({
  projectId,
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
        <PaymentSplitsTable projectId={projectId}></PaymentSplitsTable>
      )}
    </>
  );
}
