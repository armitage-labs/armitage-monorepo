import { NextRequest, NextResponse } from "next/server";
import { createAnonymousUser } from "./userService";

export type UserTrackingRequest = {
  email: string;
};

export async function POST(req: NextRequest) {
  const userTrackingRequest = (await req.json()) as UserTrackingRequest;
  if (userTrackingRequest) {
    const userId = await createAnonymousUser(userTrackingRequest.email);
    return NextResponse.json({
      success: true,
      id: userId,
    });
  }
  return NextResponse.json({
    success: false,
    id: Math.random().toString(),
  });
}
