import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";

interface TeamGithubRepositoriesSearchProps {
  teamId: string;
  foundAddRepo: any;
  setFoundAddRepo: (repos: any) => void;
  handleFetchRegisteredRepos: () => void;
}

export default function TeamGithubRepositoriesSearch({
  teamId,
  foundAddRepo,
  setFoundAddRepo,
}: TeamGithubRepositoriesSearchProps) {
  const [search, setSearch] = useState<string>("");
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

  const handleRegisterRepo = async (name: string, fullName: string) => {
    await axios.post(`/api/github/repo`, {
      name: name,
      full_name: fullName,
      team_id: teamId,
    });
    setSearch("");
    handleFetchRegisteredRepos();
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
        className="max-w-sm"
      />
      <Button
        className="items-center ml-4"
        disabled={foundAddRepo == null || searchLoading}
        onClick={() => {
          if (foundAddRepo != null) {
            handleRegisterRepo(foundAddRepo?.name, foundAddRepo?.full_name);
          }
        }}
      >
        {searchLoading ? (
          <>Loading...</>
        ) : (
          <div>
            {foundAddRepo != null ? <>Add Repo</> : <>Not valid repo</>}
          </div>
        )}
      </Button>
    </>
  );
}
