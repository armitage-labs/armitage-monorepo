"use client";

import { UserOnboarding } from "@prisma/client";
import axios from "axios";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import {
  OnboardingFlow,
  OnboardingStep,
} from "./api/onboarding/userOnboardingService";

export default function Home() {
  const [userOnboardingStatus, setUserOnboarding] = useState<UserOnboarding>();

  const handleFetchUserOnboarding = async () => {
    const { data } = await axios.get("/api/onboarding");
    if (data.success) {
      setUserOnboarding(data.onboardingStatus);
    }
  };

  const handleUpdateUserOnboarding = async () => {
    await axios.post("/api/onboarding", {
      onboardingFlow: OnboardingFlow.BETA,
      onboardingStep: OnboardingStep.COMPLETED,
    });
  };

  useEffect(() => {
    handleFetchUserOnboarding();
  }, []);

  useEffect(() => {
    if (userOnboardingStatus) {
      if (userOnboardingStatus.flow.toLowerCase() !== "beta") {
        handleUpdateUserOnboarding();
        redirect("/repositories/new");
      } else {
        redirect("/overview");
      }
    }
  }, [userOnboardingStatus]);
}
