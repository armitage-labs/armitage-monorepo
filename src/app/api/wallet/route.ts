import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { findUserWallet } from "./service";

export async function GET(req: NextRequest) {
  const session = await getServerSession(options);
  if (session?.userId) {
    const wallet = await findUserWallet(session.userId);
    return NextResponse.json({
      success: true,
      wallet: wallet,
    });
  }
  return NextResponse.json({
    success: false,
    wallet: null,
  });
}
