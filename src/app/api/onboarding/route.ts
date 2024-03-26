import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import {
  OnboardingFlow,
  OnboardingStep,
  getOnboardingStatusForUser,
  saveCreateOnboardingStatusForUser,
  updateOnboardingStatusForUser,
} from "./userOnboardingService";
import { NextRequest, NextResponse } from "next/server";
import { UpdateOnboardingStatusRequestDto } from "./updateOnboardingStatusRequest.dto";

/**
 * Updates onboarding status
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  let success = false;
  if (session?.userId) {
    success = true;
    const updateOnboardingStatusRequest =
      (await req.json()) as UpdateOnboardingStatusRequestDto;
    await updateOnboardingStatusForUser(
      session.userId,
      updateOnboardingStatusRequest.onboardingFlow,
      updateOnboardingStatusRequest.onboardingStep,
    );
  }
  return NextResponse.json({
    success: success,
  });
}

/**
 * Get the onboarding status for a user
 */
export async function GET() {
  const session = await getServerSession(options);
  let onboardingStatus = null;
  let success = false;
  if (session?.userId) {
    success = true;
    onboardingStatus = await getOnboardingStatusForUser(session.userId);
    if (onboardingStatus == null) {
      onboardingStatus = await saveCreateOnboardingStatusForUser(
        session.userId,
        OnboardingFlow.UNKNOWN,
        OnboardingStep.NOT_STARTED,
      );
    }
  }
  return NextResponse.json({
    success: success,
    onboardingStatus: onboardingStatus,
  });
}
