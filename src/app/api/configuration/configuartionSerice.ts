import prisma from "db";
import {
  WeightConfig,
  WeightConfigDto,
  weightValueMap,
} from "./weightConfig.dto";

export async function getTeamWeightConfigs(
  teamId: string
): Promise<WeightConfigDto[]> {
  const teamWeightConfigs = await prisma.teamWeightConfig.findMany({
    where: { team_id: teamId },
  });
  return teamWeightConfigs.map((config) => {
    return WeightConfigDto.fromJSON(config);
  });
}

export async function saveTeamWeightConfig(
  teamId: string,
  weightConfig: WeightConfig
): Promise<boolean> {
  for (const key in weightConfig) {
    deleteIgnoreErrors(teamId, key);
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

async function deleteIgnoreErrors(teamId: string, type: string) {
  try {
    await prisma.teamWeightConfig.deleteMany({
      where: {
        team_id: teamId,
        type: type,
      },
    });
  } catch (error) {}
}
