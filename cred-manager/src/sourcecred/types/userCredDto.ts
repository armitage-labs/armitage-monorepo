export interface UserCredJson {
  totalCred: number;
  userName: string;
  type: string;
}

export class UserCredDto {
  constructor(
    public totalCred: number,
    public userName: string,
    public type: string,
  ) {}

  toJSON(): UserCredJson {
    return {
      totalCred: this.totalCred,
      userName: this.userName,
      type: this.type,
    };
  }

  static fromJSON(json: UserCredJson): UserCredDto {
    return new UserCredDto(json.totalCred, json.userName, json.type);
  }
}
