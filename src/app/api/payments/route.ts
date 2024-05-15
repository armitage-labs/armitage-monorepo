import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import {
  createPaymentAddress,
  fetchTeamPaymentAddresses,
} from "./service/paymentAddressService";

export type PaymentAddressDto = {
  id?: string;
  chain_id: string;
  team_id: string;
  wallet_address: string;
  created_at?: Date;
  payment_receipents: PaymentRecipientDto[];
};

export type PaymentRecipientDto = {
  id?: string;
  wallet_address: string;
  payment_percentage: number;
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  const teamId = req.nextUrl.searchParams.get("team_id");
  const paymentAddressRequest = (await req.json()) as PaymentAddressDto;
  if (session?.userId && teamId && paymentAddressRequest) {
    const paymentAddress = await createPaymentAddress(
      session?.userId,
      teamId,
      paymentAddressRequest,
    );
    if (paymentAddress) {
      return NextResponse.json({
        success: true,
        paymentAddress: paymentAddress,
      });
    }
    return NextResponse.json({
      success: false,
    });
  } else {
    return NextResponse.json({
      success: false,
    });
  }
}

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
    });
  }
}
