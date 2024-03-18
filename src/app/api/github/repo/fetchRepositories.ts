import { GithubRepoDto } from "./types/githubRepo.dto";

export async function fetchPaginatedGithubRepoResult(
  githubAccessToken: string,
): Promise<GithubRepoDto[]> {
  let currentPage = 1;
  let mergedGithubRepos: GithubRepoDto[] = [];
  while (true) {
    const fetchGithubReposRequest = await fetch(
      `https://api.github.com/user/repos?&per_page=100&sort=updated&page=${currentPage}`,
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
    mergedGithubRepos = mergedGithubRepos.concat(parsedGithubRepos);
    currentPage = currentPage + 1;
    if (parsedGithubRepos.length == 0) return mergedGithubRepos;
  }
}
