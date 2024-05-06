import { useState } from "react";
import OnboardingTutorial from "./onboardingTutorial";
import ContributorsTable from "./contributors/contributorsTable";

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
        <ContributorsTable projectId={projectId}></ContributorsTable>
      )}
    </>
  );
}
