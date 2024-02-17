export class GithubRepoDto {
  constructor(
    public id: string,
    public team_id: string,
    public name: string,
    public full_name: string,
  ) {}
}
