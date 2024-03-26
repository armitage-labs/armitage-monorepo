"use client";

import { UserOnboarding } from "@prisma/client";
import axios from "axios";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [userOnboardingStatus, setUserOnboarding] = useState<UserOnboarding>();

  const handleFetchUserOnboarding = async () => {
    const { data } = await axios.get("/api/onboarding");
    if (data.success) {
      setUserOnboarding(data.onboardingStatus);
    }
  };

  useEffect(() => {
    handleFetchUserOnboarding();
  }, []);

  useEffect(() => {
    // if (userOnboardingStatus?. === "completed") {
    //   redirect("/repositories/new");
    // } else {
    redirect("/overview");
    // }
  }, [userOnboardingStatus]);

  redirect("/overview");
}
