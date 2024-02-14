import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export interface UserCredDto {
  totalCred: number;
  userName: string;
  type: string;
}

export async function GET() {
  try {
    const session = await getServerSession(options);
    if (session?.userId) {
      const calculatedUserCredDtos = await fetch(
        `http://localhost:8080/cred/user/${session?.userId}`,
        {
          method: "GET",
        },
      );
      return NextResponse.json({
        success: true,
        userCredDtos: await calculatedUserCredDtos.json(),
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, userCredDtos: [] });
  }
}
