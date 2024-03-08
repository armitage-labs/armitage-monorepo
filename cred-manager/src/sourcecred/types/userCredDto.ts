export interface UserCredJson {
  totalCred: number;
  userName: string;
  type: string;
  credPerInterval?: number[];
  grainEarnedPerInterval?: string[];
}

export class UserCredDto {
  constructor(
    public totalCred: number,
    public userName: string,
    public type: string,
    public credPerInterval?: number[],
    public grainEarnedPerInterval?: string[]
  ) {}

  toJSON(): UserCredJson {
    return {
      totalCred: this.totalCred,
      userName: this.userName,
      type: this.type,
      credPerInterval: this.credPerInterval,
      grainEarnedPerInterval: this.grainEarnedPerInterval
    };
  }

  static fromJSON(json: UserCredJson): UserCredDto {
    return new UserCredDto(json.totalCred, json.userName, json.type, json.credPerInterval, json.grainEarnedPerInterval);
  }
}
