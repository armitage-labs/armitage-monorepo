export class UserScoreRepoDto {
  constructor(
    public id: string,
    public contribution_calculation_id: string,
    public username: string,
    public user_type: string,
    public score: string,
    public created_at: Date,
  ) {}
}
