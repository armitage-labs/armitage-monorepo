"use client";

import { Circles } from "react-loader-spinner";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
// import { UserCredDto } from "../api/credmanager/route";
import { CreateTeamCard } from "@/components/teams/createTeam";

export default function CreateTeam() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [createTeamName, setCreateTeamName] = useState<string>();

  const handleCreateTeam = async () => {
    setIsLoading(true);
    const { data } = await axios.post("/api/teams", { name: createTeamName });
    if (data.success) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (session?.userId) {
      setIsLoading(false);
    }
  }, [session]);

  return (
    <main>
      <section className="pt-6">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 pb-6">
          <div className="flex justify-center">
            {!isLoading ? (
              <div>
                <div>
                  <div className="pt-6"></div>
                  <div className="pt-6">
                    <CreateTeamCard
                      handleCreateTeam={handleCreateTeam}
                      setCreateTeamName={setCreateTeamName}
                    ></CreateTeamCard>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-36 flex justify-center">
                <Circles />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
