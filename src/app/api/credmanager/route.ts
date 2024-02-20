import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export interface UserCredDto {
  totalCred: number;
  userName: string;
  type: string;
}

export async function GET(req: NextRequest) {
  try {
    const teamId = req.nextUrl.searchParams.get("team_id");
    const session = await getServerSession(options);
    if (teamId) {
      // process.
      const calculatedUserCredDtos = await fetch(
        `http://localhost:8080/cred/team/${teamId}/${session?.accessToken}`,
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
