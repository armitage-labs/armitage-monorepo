export class GithubRepoDto {
  constructor(
    public id: string,
    public user_id: string,
    public name: string,
    public full_name: string,
  ) {}
}
