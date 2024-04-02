import { NextRequest, NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import {
  getTeamWeightConfigs,
  saveTeamWeightConfig,
} from "./configuartionSerice";
import { getServerSession } from "next-auth";
import {
  WeightConfigDto,
  WeightConfig,
  defaultConfigResponse,
  weightValueMap,
} from "./weightConfig.dto";

export async function GET(req: NextRequest) {
  const session = await getServerSession(options);
  const teamId = req.nextUrl.searchParams.get("team_id");
  if (session?.userId && teamId) {
    const weightConfigDto = await getTeamWeightConfigs(teamId);
    return NextResponse.json({
      success: true,
      weights: mapToDto(weightConfigDto),
    });
  }
  return NextResponse.json({ success: false, weights: [] });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  const teamId = req.nextUrl.searchParams.get("team_id");
  if (session?.userId && teamId) {
    const weightConfig = (await req.json()) as WeightConfig;
    await saveTeamWeightConfig(teamId, weightConfig);
    return NextResponse.json({
      success: true,
      weights: weightConfig,
    });
  }
  return NextResponse.json({ success: false, weights: [] });
}

function mapToDto(weights: WeightConfigDto[]): WeightConfig {
  const response = defaultConfigResponse;
  weights.forEach((weight) => {
    if (response[weight.type]) {
      response[weight.type].value = weightValueMap.indexOf(weight.value);
    }
  });
  return response;
}
