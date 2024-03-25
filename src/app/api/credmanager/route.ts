import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { EventName, createEvent } from "../event/createEvent";

export interface UserCredDto {
  totalCred: number;
  userName: string;
  type: string;
}

export async function GET(req: NextRequest) {
  // try {
  const teamId = req.nextUrl.searchParams.get("team_id");
  const session = await getServerSession(options);
  if (teamId && session?.userId != null) {
    const CRED_MANAGER_ROUTE = process.env.CRED_MANAGER_ROUTE;
    const calculatedUserCredDtos = await fetch(
      `${CRED_MANAGER_ROUTE}/cred/team/${teamId}/${session?.accessToken}/${session?.user?.email}`,
      {
        method: "GET",
      },
    );
    createEvent(session?.userId, EventName.REQUEST_CALCULATION, {
      teamId: teamId,
    });
    return NextResponse.json({
      success: true,
      userCredDtos: calculatedUserCredDtos.json(),
    });
  }
  // } catch (error) {
  //   console.error(error);
  return NextResponse.json({ success: false, userCredDtos: [] });
  // }
}
