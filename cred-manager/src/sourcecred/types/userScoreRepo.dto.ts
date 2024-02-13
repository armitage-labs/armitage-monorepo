export class UserScoreRepoDto {
    constructor(
      public id: string,
      public user_id: string,
      public created_at: Date
    ) {}
  }