import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { fetchTeamPaymentAddresses } from "./service/paymentAddressService";

export async function GET(req: NextRequest) {
  const session = await getServerSession(options);
  const teamId = req.nextUrl.searchParams.get("team_id");
  if (session?.userId && teamId) {
    const paymentAddress = await fetchTeamPaymentAddresses(teamId);
    return NextResponse.json({
      success: true,
      paymentAddress: paymentAddress,
    });
  } else {
    return NextResponse.json({
      success: false,
      paymentAddress: [],
    });
  }
}
