import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { RepoDropdown } from "@/components/repoDropdown";

export default async function GitRepo() {
  const session = await getServerSession(options);

  return (
    <main>
      <section className="pt-16">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 pb-6">
          <div>
            <RepoDropdown repositories={[]}></RepoDropdown>
          </div>
        </div>
      </section>
    </main>
  );
}
