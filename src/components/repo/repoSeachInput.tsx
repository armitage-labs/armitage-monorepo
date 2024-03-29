import { GithubRepoDto } from "@/app/api/github/repo/types/githubRepo.dto";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface RepoSearchInputProps {
  onSelectRepo: (repo: GithubRepoDto) => void;
  loadingTeamTransition?: boolean;
}

export function RepoSearchInput({
  onSelectRepo,
  loadingTeamTransition,
}: RepoSearchInputProps) {
  const [search, setSearch] = useState<string>("");
  const [foundAddRepo, setFoundAddRepo] = useState<GithubRepoDto>();
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const handleSearchRepo = async () => {
    const { data } = await axios.get(`/api/search/repo?name=${search}`);

    if (data?.results?.length == 1) {
      setFoundAddRepo(data?.results[0]);
    } else {
      setFoundAddRepo(undefined);
    }
    setSearchLoading(false);
  };

  useEffect(() => {
    setSearchLoading(true);
    const delayDebounceFn = setTimeout(() => {
      handleSearchRepo();
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <>
      <Input
        placeholder="Search with owner/name ... "
        onChange={(event) => setSearch(event.target.value)}
        value={search}
        className="w-full"
      />
      <Button
        className="items-center ml-4"
        onClick={() => {
          if (foundAddRepo) {
            onSelectRepo(foundAddRepo);
          }
        }}
        disabled={
          foundAddRepo == null || searchLoading || loadingTeamTransition
        }
      >
        {searchLoading ? (
          <>Loading...</>
        ) : (
          <div>
            {foundAddRepo != null ? <>Select Repo</> : <>Not valid repo</>}
          </div>
        )}
      </Button>
    </>
  );
}
