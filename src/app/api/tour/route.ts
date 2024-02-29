import prisma from "db";

import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(options);
  if (session?.userId) {
    const foundTour = await prisma.productTourView.findFirst({
      where: {
        user_id: session.userId,
      },
    });
    if (foundTour) {
      return NextResponse.json({ success: true, hasSeenProductTour: true });
    } else {
      await prisma.productTourView.create({
        data: {
          user_id: session.userId,
        },
      });
      return NextResponse.json({ success: true, hasSeenProductTour: false });
    }
  }
  return NextResponse.json({ success: false, hasSeenProductTour: false });
}
