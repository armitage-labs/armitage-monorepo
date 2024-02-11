import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(options);
    if (session?.userId) {
      const calculatedUserCredDtos = await fetch(
        `http://localhost:8080/cred/user${session?.userId}`,
        {
          method: "GET",
        },
      );
      return NextResponse.json({
        success: true,
        userCredDto: calculatedUserCredDtos,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, userCredDto: [] });
  }
}
