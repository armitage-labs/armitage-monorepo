import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { GithubRepoDto } from "../api/github/repo/types/githubRepo.dto";
import { fetchPaginatedGithubRepoResult } from "../api/github/repo/fetchRepositories";
import { DataTable } from "./data-table";
import { GitRepoView, columns } from "./columns";
import { fetchRegisteredGitRepos } from "../api/github/repo/registered/fetchRegisteredRepos";
import { Button } from "@/components/ui/button";

export default async function GitRepo() {
  const session = await getServerSession(options);
  let githubRepos: GithubRepoDto[] = [];
  let githubRepoColumnData: GitRepoView[] = [];

  if (session?.accessToken && session.githubLogin && session.userId) {
    githubRepos = await fetchPaginatedGithubRepoResult(
      session.accessToken,
      session.githubLogin,
    );
    const registeredGitRepos = await fetchRegisteredGitRepos(session.userId);
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
        initially_registered: registeredGitRepos.some(
          (registeredRepo) =>
            registeredRepo.full_name === githubRepoDto.full_name,
        ),
      }));
    }
  }

  return (
    <main>
      <section className="pt-6">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 pb-6">
          <div>
            <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
              <li className="flex items-center text-blue-600 dark:text-blue-500 space-x-2.5 rtl:space-x-reverse">
                <span className="flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                  1
                </span>
                <span>
                  <h3 className="font-medium leading-tight">
                    Choose Repositories
                  </h3>
                  <p className="text-sm">Click on checkbox to register</p>
                </span>
              </li>
              <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                  2
                </span>
                <span>
                  <h3 className="font-medium leading-tight">
                    Calculate contributions
                  </h3>
                  <p className="text-sm">
                    Confirm your preferences and click `generate`
                  </p>
                </span>
              </li>
              <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                  3
                </span>
                <span>
                  <h3 className="font-medium leading-tight">Analyze results</h3>
                  <p className="text-sm"></p>
                </span>
              </li>
            </ol>
          </div>
          <div className="flex justify-center">
            {githubRepos ? (
              <div>
                <div className="pt-6">
                  <DataTable
                    columns={columns}
                    data={githubRepoColumnData}
                  ></DataTable>
                  <Button className="w-full">Generate</Button>
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
