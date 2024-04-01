import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { EventName, createEvent } from "../event/createEvent";
import { createContributionRequest } from "./createCalculationRequest";

export interface UserCredDto {
  totalCred: number;
  userName: string;
  type: string;
}

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("team_id");
  const session = await getServerSession(options);
  if (teamId && session?.userId != null) {
    createEvent(session?.userId, EventName.REQUEST_CALCULATION, {
      teamId: teamId,
    });

    const contributionRequest = await createContributionRequest(
      teamId,
      session.accessToken!,
      session!.user!.email!,
    );

    return NextResponse.json({
      success: true,
    });
  } else {
    return NextResponse.json({ success: false });
  }
}
