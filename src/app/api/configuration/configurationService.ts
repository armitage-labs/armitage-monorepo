import prisma from "db";
import {
  WeightConfig,
  WeightConfigDto,
  defaultConfigResponse,
  weightValueMap,
} from "./weightConfig.dto";

export async function getTeamWeightConfigs(
  teamId: string,
): Promise<WeightConfig> {
  const teamWeightConfigs = await prisma.teamWeightConfig.findMany({
    where: { team_id: teamId },
  });
  return mapToDto(
    teamWeightConfigs.map((config) => {
      return WeightConfigDto.fromJSON(config);
    }),
  );
}

export async function saveTeamWeightConfig(
  teamId: string,
  weightConfig: WeightConfig,
): Promise<boolean> {
  for (const key in weightConfig) {
    await prisma.teamWeightConfig.deleteMany({
      where: {
        team_id: teamId,
        type: key,
      },
    });
    await prisma.teamWeightConfig.create({
      data: {
        team_id: teamId,
        type: key,
        value: weightValueMap[weightConfig[key].value],
      },
    });
  }
  return true;
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
