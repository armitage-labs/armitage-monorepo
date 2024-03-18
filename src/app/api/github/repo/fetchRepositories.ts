import { GithubRepoDto } from "./types/githubRepo.dto";

export async function fetchPaginatedGithubRepoResult(
  githubAccessToken: string,
  page: number,
  per_page: number,
): Promise<GithubRepoDto[]> {
  console.log(
    `https://api.github.com/user/repos?page=${page}&per_page=${per_page}&sort=updated`,
  );
  const fetchGithubReposRequest = await fetch(
    `https://api.github.com/user/repos?page=${page}&per_page=${per_page}&sort=updated`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${githubAccessToken}`,
        "X-GitHub-Api-Version": `2022-11-28`,
      },
    },
  );
  const fetchedGithubRepos = await fetchGithubReposRequest.text();
  const parsedGithubRepos = JSON.parse(fetchedGithubRepos) as GithubRepoDto[];
  return parsedGithubRepos;
}
