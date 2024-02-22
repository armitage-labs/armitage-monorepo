import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";
import { fetchCredSum } from "./fetchCredSum";

export async function GET() {
  try {
    const session = await getServerSession(options);
    if (session?.userId) {
      const credSum = await fetchCredSum(session.userId);
      return NextResponse.json({ success: true, credSum: credSum });
    }
    return NextResponse.json({ success: false, credSum: null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, credSum: null });
  }
}
