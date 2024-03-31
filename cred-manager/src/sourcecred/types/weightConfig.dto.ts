export interface WeightConfigJson {
  id: string;
  type: string;
  value: number;
  team_id: string;
}

export class WeightConfigDto {
  constructor(
    public id: string,
    public type: string,
    public value: number,
    public teamId: string,
  ) {}

  toJSON(): WeightConfigJson {
    return {
      id: this.id,
      type: this.type,
      value: this.value,
      team_id: this.teamId,
    };
  }

  static fromJSON(json: WeightConfigJson): WeightConfigDto {
    return new WeightConfigDto(json.id, json.type, json.value, json.team_id);
  }
}

export enum WeightConfigTypeToSc {
  EDGE_AUTHOR_FORWARD = 'E\u0000sourcecred\u0000github\u0000AUTHORS\u0000',
  EDGE_AUTHOR_BACKWARDS = 'E\u0000sourcecred\u0000github\u0000AUTHORS\u0000',
  EDGE_COMMIT_FORWARD = 'E\u0000sourcecred\u0000github\u0000CORRESPONDS_TO_COMMIT_TYPE\u0000',
  EDGE_COMMIT_BACKWARDS = 'E\u0000sourcecred\u0000github\u0000CORRESPONDS_TO_COMMIT_TYPE\u0000',
  EDGE_PARENT_FORWARD = 'E\u0000sourcecred\u0000github\u0000HAS_PARENT\u0000',
  EDGE_PARENT_BACKWARDS = 'E\u0000sourcecred\u0000github\u0000HAS_PARENT\u0000',
  EDGE_MERGE_FORWARD = 'E\u0000sourcecred\u0000github\u0000MERGED_AS\u0000',
  EDGE_MERGE_BACKWARDS = 'E\u0000sourcecred\u0000github\u0000MERGED_AS\u0000',
  EDGE_HEART_FORWARD = 'E\u0000sourcecred\u0000github\u0000REACTS\u0000HEART\u0000',
  EDGE_HEART_BACKWARDS = 'E\u0000sourcecred\u0000github\u0000REACTS\u0000HEART\u0000',
  EDGE_HOORAY_FORWARD = 'E\u0000sourcecred\u0000github\u0000REACTS\u0000HOORAY\u0000',
  EDGE_HOORAY_BACKWARDS = 'E\u0000sourcecred\u0000github\u0000REACTS\u0000HOORAY\u0000',
  EDGE_ROCKET_FORWARD = 'E\u0000sourcecred\u0000github\u0000REACTS\u0000ROCKET\u0000',
  EDGE_ROCKET_BACKWARDS = 'E\u0000sourcecred\u0000github\u0000REACTS\u0000ROCKET\u0000',
  EDGE_THUMBSUP_FORWARD = 'E\u0000sourcecred\u0000github\u0000REACTS\u0000THUMBS_UP\u0000',
  EDGE_THUMBSUP_BACKWARDS = 'E\u0000sourcecred\u0000github\u0000REACTS\u0000THUMBS_UP\u0000',
  EDGE_REFERENCE_FORWARD = 'E\u0000sourcecred\u0000github\u0000REFERENCES\u0000',
  EDGE_REFERENCE_BACKWARDS = 'E\u0000sourcecred\u0000github\u0000REFERENCES\u0000',
  NODE_COMMENT = 'N\u0000sourcecred\u0000github\u0000COMMENT\u0000',
  NODE_COMMIT = 'N\u0000sourcecred\u0000github\u0000COMMIT\u0000',
  NODE_ISSUE = 'N\u0000sourcecred\u0000github\u0000ISSUE\u0000',
  NODE_PULL = 'N\u0000sourcecred\u0000github\u0000PULL\u0000',
  NODE_REPO = 'N\u0000sourcecred\u0000github\u0000REPO\u0000',
  NODE_REVIEW = 'N\u0000sourcecred\u0000github\u0000REVIEW\u0000',
  NODE_BOT = 'N\u0000sourcecred\u0000github\u0000USERLIKE\u0000BOT\u0000',
}

export const EdgeWeightsArray = [
  'EDGE_AUTHOR_FORWARD',
  'EDGE_AUTHOR_BACKWARDS',
  'EDGE_COMMIT_FORWARD',
  'EDGE_COMMIT_BACKWARDS',
  'EDGE_PARENT_FORWARD',
  'EDGE_PARENT_BACKWARDS',
  'EDGE_MERGE_FORWARD',
  'EDGE_MERGE_BACKWARDS',
  'EDGE_HEART_FORWARD',
  'EDGE_HEART_BACKWARDS',
  'EDGE_HOORAY_FORWARD',
  'EDGE_HOORAY_BACKWARDS',
  'EDGE_ROCKET_FORWARD',
  'EDGE_ROCKET_BACKWARDS',
  'EDGE_THUMBSUP_FORWARD',
  'EDGE_THUMBSUP_BACKWARDS',
  'EDGE_REFERENCE_FORWARD',
  'EDGE_REFERENCE_BACKWARDS',
];

export const NodeWeightsArray = [
  'NODE_BOT',
  'NODE_REVIEW',
  'NODE_REPO',
  'NODE_PULL',
  'NODE_ISSUE',
  'NODE_COMMIT',
  'NODE_COMMENT',
];
