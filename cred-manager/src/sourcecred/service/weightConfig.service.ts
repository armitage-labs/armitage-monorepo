import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  EdgeWeightsArray,
  NodeWeightsArray,
  WeightConfigDto,
} from '../types/weightConfig.dto';

@Injectable()
export class WeightConfigService {
  constructor(private readonly prismaService: PrismaService) {}

  async getTeamWeightConfigs(teamId: string): Promise<WeightConfigDto[]> {
    const teamWeightConfigs =
      await this.prismaService.teamWeightConfig.findMany({
        where: { team_id: teamId },
      });
    return teamWeightConfigs.map((config) => {
      return WeightConfigDto.fromJSON(config);
    });
  }

  async transformTeamWeightConfigsToScJsonStringified(
    teamWeightConfigs: WeightConfigDto[],
  ): Promise<{}[]> {
    const scWeightConfig: {}[] = [
      { type: 'sourcecred/weights', version: '0.2.0' },
    ];
    const nodeWeightsMap = new Map(
      teamWeightConfigs
        .filter((config) => NodeWeightsArray.includes(config.type))
        .map((config) => [config.type, config.value]),
    );
    const edgeWeightsMap = new Map(
      teamWeightConfigs
        .filter((config) => EdgeWeightsArray.includes(config.type))
        .map((config) => [config.type, config.value]),
    );

    const nodeWeightsObject = {
      nodeWeights: {
        'N\u0000sourcecred\u0000github\u0000COMMENT\u0000':
          nodeWeightsMap.get('NODE_COMMENT') || 0,
        'N\u0000sourcecred\u0000github\u0000COMMIT\u0000':
          nodeWeightsMap.get('NODE_COMMIT') || 0,
        'N\u0000sourcecred\u0000github\u0000ISSUE\u0000':
          nodeWeightsMap.get('NODE_ISSUE') || 0,
        'N\u0000sourcecred\u0000github\u0000PULL\u0000':
          nodeWeightsMap.get('NODE_PULL') || 4,
        'N\u0000sourcecred\u0000github\u0000REPO\u0000':
          nodeWeightsMap.get('NODE_REPO') || 0,
        'N\u0000sourcecred\u0000github\u0000REVIEW\u0000':
          nodeWeightsMap.get('NODE_REVIEW') || 1,
        'N\u0000sourcecred\u0000github\u0000USERLIKE\u0000BOT\u0000':
          nodeWeightsMap.get('NODE_BOT') || 0,
      },
    };

    const edgeWeightsObject = {
      edgeWeights: {
        'E\u0000sourcecred\u0000github\u0000AUTHORS\u0000': {
          backwards: edgeWeightsMap.get('EDGE_AUTHOR_BACKWARDS') || 1,
          forwards: edgeWeightsMap.get('EDGE_AUTHOR_FORWARD') || 0.5,
        },
        'E\u0000sourcecred\u0000github\u0000CORRESPONDS_TO_COMMIT_TYPE\u0000': {
          backwards: edgeWeightsMap.get('EDGE_COMMIT_BACKWARDS') || 1,
          forwards: edgeWeightsMap.get('EDGE_COMMIT_FORWARD') || 1,
        },
        'E\u0000sourcecred\u0000github\u0000HAS_PARENT\u0000': {
          backwards: edgeWeightsMap.get('EDGE_PARENT_BACKWARDS') || 0.25,
          forwards: edgeWeightsMap.get('EDGE_PARENT_FORWARD') || 1,
        },
        'E\u0000sourcecred\u0000github\u0000MERGED_AS\u0000': {
          backwards: edgeWeightsMap.get('EDGE_MERGE_BACKWARDS') || 1,
          forwards: edgeWeightsMap.get('EDGE_MERGE_FORWARD') || 0.5,
        },
        'E\u0000sourcecred\u0000github\u0000REACTS\u0000HEART\u0000': {
          backwards: edgeWeightsMap.get('EDGE_HEART_BACKWARDS') || 0,
          forwards: edgeWeightsMap.get('EDGE_HEART_FORWARD') || 2,
        },
        'E\u0000sourcecred\u0000github\u0000REACTS\u0000HOORAY\u0000': {
          backwards: edgeWeightsMap.get('EDGE_HOORAY_BACKWARDS') || 0,
          forwards: edgeWeightsMap.get('EDGE_HOORAY_FORWARD') || 4,
        },
        'E\u0000sourcecred\u0000github\u0000REACTS\u0000ROCKET\u0000': {
          backwards: edgeWeightsMap.get('EDGE_ROCKET_BACKWARDS') || 0,
          forwards: edgeWeightsMap.get('EDGE_ROCKET_FORWARD') || 1,
        },
        'E\u0000sourcecred\u0000github\u0000REACTS\u0000THUMBS_UP\u0000': {
          backwards: edgeWeightsMap.get('EDGE_THUMBSUP_BACKWARDS') || 0,
          forwards: edgeWeightsMap.get('EDGE_THUMBSUP_FORWARD') || 1,
        },
        'E\u0000sourcecred\u0000github\u0000REFERENCES\u0000': {
          backwards: edgeWeightsMap.get('EDGE_REFERENCE_BACKWARDS') || 0,
          forwards: edgeWeightsMap.get('EDGE_REFERENCE_FORWARD') || 1,
        },
      },
    };

    scWeightConfig.push({ ...nodeWeightsObject, ...edgeWeightsObject });

    return scWeightConfig;
  }
}
