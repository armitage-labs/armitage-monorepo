import { Decimal } from "@prisma/client/runtime/library";

export class UserScoreRepoDto {
    constructor(
      public id: string,
      public contribution_id: string,
      public username: string,
      public user_type: string,
      public score: Decimal,
      public created_at: Date
    ) {}
  }