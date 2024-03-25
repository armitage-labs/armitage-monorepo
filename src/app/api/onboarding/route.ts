import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import {
  OnboardingFlow,
  OnboardingStep,
  getOnboardingStatusForUser,
  saveCreateOnboardingStatusForUser,
} from "./userOnboardingService";
import { NextRequest, NextResponse } from "next/server";
import { UpdateOnboardingStatusRequestDto } from "./updateOnboardingStatusRequest.dto";

/**
 * Creates / updates onboarding status
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  let success = false;
  let onboardingStatus = null;
  if (session?.userId) {
    success = true;
    const updateOnboardingStatusRequest =
      (await req.json()) as UpdateOnboardingStatusRequestDto;
    onboardingStatus = await getOnboardingStatusForUser(session.userId);
    if (onboardingStatus == null) {
      onboardingStatus = await saveCreateOnboardingStatusForUser(
        session.userId,
        updateOnboardingStatusRequest.onboardingFlow,
        updateOnboardingStatusRequest.onboardingStep,
      );
    }
  }
  return NextResponse.json({
    success: success,
    onboardingStatus: onboardingStatus,
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
