import { NextRequest, NextResponse } from "next/server";

export interface UserCredDto {
  totalCred: number;
  userName: string;
  type: string;
}

export async function GET(req: NextRequest) {
  try {
    console.log("ROUTE");
    const teamId = req.nextUrl.searchParams.get("team_id");
    if (teamId) {
      const calculatedUserCredDtos = await fetch(
        `http://localhost:8080/cred/team/${teamId}`,
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
