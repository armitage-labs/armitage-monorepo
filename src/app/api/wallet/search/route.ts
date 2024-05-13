import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";
import { seachUsernameByWalletAddress } from "../service";

export interface SplitRecipient {
  username?: string;
  ens?: string;
  percentAllocation: number;
  address: string;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  const splitRecipient = (await req.json()) as SplitRecipient[];
  if (session?.userId && splitRecipient) {
    const mapedRecipient = await Promise.all(
      splitRecipient.map(async (recipient) => {
        const username = await seachUsernameByWalletAddress(recipient.address);
        return {
          percentAllocation: recipient.percentAllocation,
          address: recipient.address,
          username: username ?? null,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      data: mapedRecipient,
    });
  }
  return NextResponse.json({
    success: false,
    data: null,
  });
}
