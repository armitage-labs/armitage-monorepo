"use client";

import { signOut, useSession } from "next-auth/react";
import { SplitsProvider } from "@0xsplits/splits-sdk-react";
import { useEffect, useState } from "react";
import { useChainId, usePublicClient, useWalletClient } from "wagmi";

type Props = {
  children?: React.ReactNode;
};

export const SessionRefreshProvider = ({ children }: Props) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const { data: session } = useSession();
  const { data: walletClient, status } = useWalletClient();
  const publicClient = usePublicClient();
  const chainId = useChainId();

  let splitsConfig = {
    chainId: chainId,
    walletClient: walletClient,
    publicClient: publicClient,
    apiConfig: { apiKey: "a6431f24145432df1796251c" }, // todo move to config api
  };

  useEffect(() => {
    if (session?.error) {
      if (session.error === "RefreshAccessTokenError") {
        console.log("Refreshing the access token");
        signOut({ callbackUrl: "/" });
      }
    }
  }, [session]);

  useEffect(() => {
    if (status == "success") {
      splitsConfig = {
        chainId: chainId,
        walletClient: walletClient,
        publicClient: publicClient,
        apiConfig: { apiKey: "a6431f24145432df1796251c" }, // todo move to config api
      };
      setLoaded(true);
    }
  }, [status]);

  return (
    <>
      {loaded ? (
        <SplitsProvider config={splitsConfig}>{children}</SplitsProvider>
      ) : (
        <>Loading</>
      )}
    </>
  );
};
