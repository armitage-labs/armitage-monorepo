import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { generateNonce, SiweMessage } from "siwe";
import { options } from "../../auth/[...nextauth]/options";
import { saveUserWallet } from "../service";

export type SiweMessageRequest = {
  message: string;
  signature: string;
  nonce: string;
};

export async function GET(req: NextRequest) {
  const session = await getServerSession(options);
  if (session?.accessToken && session?.githubLogin) {
    const nonce = generateNonce();
    return NextResponse.json({ success: true, nonce: nonce });
  }
  return NextResponse.json({ success: false });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  if (session?.userId && session?.githubLogin) {
    const siweMessageRequest = (await req.json()) as SiweMessageRequest;
    const siweMessage = new SiweMessage(siweMessageRequest.message);
    const fields = await siweMessage.verify({
      signature: siweMessageRequest.signature,
    });
    const wallet = await saveUserWallet(session.userId, fields.data.address);
    if (fields.data.nonce !== siweMessageRequest.nonce) {
      return NextResponse.json({ success: false });
    }
    return NextResponse.json({ success: true, wallet: wallet });
  }
  return NextResponse.json({ success: false });
}
