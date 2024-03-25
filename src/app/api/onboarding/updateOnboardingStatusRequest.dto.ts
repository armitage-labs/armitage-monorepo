import { OnboardingFlow, OnboardingStep } from "./userOnboardingService";

export type UpdateOnboardingStatusRequestDto = {
  onboardingFlow: OnboardingFlow;
  onboardingStep: OnboardingStep;
};
