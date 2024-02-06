import { getServerSession } from "next-auth";
import axios from "axios";
import { options } from "../api/auth/[...nextauth]/options";
import { RepoDropdown } from "@/components/repoDropdown";
import { GithubRepoDto } from "../api/github/repo/types/githubRepo.dto";
import { fetchPaginatedGithubRepoResult } from "../api/github/repo/fetchRepositories";
import { DataTable } from "./data-table";
import { GitRepoView, columns } from "./columns";

// function to check if number is even or odd
export default async function GitRepo() {
  const session = await getServerSession(options);
  let githubRepos: GithubRepoDto[] = [];
  let githubRepoColumnData: GitRepoView[] = [];

  if (session?.accessToken && session.githubLogin) {
    githubRepos = await fetchPaginatedGithubRepoResult(
      session.accessToken,
      session.githubLogin,
    );
    if (githubRepos.length > 1) {
      // match githubRepos into githubRepoColumnData on a map function
      githubRepoColumnData = githubRepos.map((githubRepoDto) => ({
        id: githubRepoDto.id,
        name: githubRepoDto.name,
        full_name: githubRepoDto.full_name,
        stars: githubRepoDto.stargazers_count,
        owner: githubRepoDto.owner.login,
        forks: githubRepoDto.forks_count,
        created_at: githubRepoDto.created_at,
        html_url: githubRepoDto.html_url,
      }));
    }
  }

  return (
    <main>
      <section className="pt-16">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 pb-6">
          <div>
            {githubRepos ? (
              <div>
                <RepoDropdown repositories={githubRepos}></RepoDropdown>
                <div className="pt-6">
                  <DataTable
                    columns={columns}
                    data={githubRepoColumnData}
                  ></DataTable>
                </div>
              </div>
            ) : (
              <div>loading</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
