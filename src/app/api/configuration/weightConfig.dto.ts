export const defaultConfigResponse: WeightConfig = {
  NODE_REVIEW: {
    lable: "Pull Request Review",
    title: "Pull Request Review Weight",
    description:
      "This slider adjusts the amount of credits you would like to generate for pull requests reviews.",
    value: 5, // default value
    min: 0,
    max: 10,
    step: 1,
  },
  NODE_PULL: {
    lable: "Pull Request",
    title: "Pull Request Weight",
    description:
      "This slider adjusts the amount of credits you would like to generate for merged pull requests.",
    value: 7, // default value
    min: 0,
    max: 10,
    step: 1,
  },
  NODE_ISSUE: {
    lable: "Issue",
    title: "Issue Weight",
    description:
      "This slider adjusts the amount of credits you would like to generate for completed issues.",
    value: 0, // default value
    min: 0,
    max: 10,
    step: 1,
  },
  NODE_COMMIT: {
    lable: "Commit",
    title: "Commit Weight",
    description:
      "This slider adjusts the amount of credits you would like to generate for commits that accepted.",
    value: 0, // default value
    min: 0,
    max: 10,
    step: 1,
  },
  NODE_COMMENT: {
    lable: "Comment",
    title: "Comment Weight",
    description:
      "This slider adjusts the amount of credits you would like to generate for comment on pull requests.",
    value: 0, // default value
    min: 0,
    max: 10,
    step: 1,
  },
};

export interface WeightConfigField {
  lable: string;
  title: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export interface WeightConfig {
  [key: string]: WeightConfigField;
}

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

export const EdgeWeightsArray = [
  "EDGE_AUTHOR_FORWARD",
  "EDGE_AUTHOR_BACKWARDS",
  "EDGE_COMMIT_FORWARD",
  "EDGE_COMMIT_BACKWARDS",
  "EDGE_PARENT_FORWARD",
  "EDGE_PARENT_BACKWARDS",
  "EDGE_MERGE_FORWARD",
  "EDGE_MERGE_BACKWARDS",
  "EDGE_HEART_FORWARD",
  "EDGE_HEART_BACKWARDS",
  "EDGE_HOORAY_FORWARD",
  "EDGE_HOORAY_BACKWARDS",
  "EDGE_ROCKET_FORWARD",
  "EDGE_ROCKET_BACKWARDS",
  "EDGE_THUMBSUP_FORWARD",
  "EDGE_THUMBSUP_BACKWARDS",
  "EDGE_REFERENCE_FORWARD",
  "EDGE_REFERENCE_BACKWARDS",
];

export const NodeWeightsArray = [
  "NODE_BOT",
  "NODE_REVIEW",
  "NODE_REPO",
  "NODE_PULL",
  "NODE_ISSUE",
  "NODE_COMMIT",
  "NODE_COMMENT",
];

export const weightValueMap: number[] = [
  0, // 0
  0.0625, // 1
  0.125, // 2
  0.25, // 3
  0.5, // 4
  1, // 5
  2, // 6
  4, // 7
  8, // 8
  16, // 9
  32, // 10
];
