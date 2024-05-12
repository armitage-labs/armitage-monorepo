"use client";

import { signOut, useSession } from "next-auth/react";
import { SplitsProvider } from "@0xsplits/splits-sdk-react";
import { useEffect } from "react";
import { useChainId, useWalletClient } from "wagmi";

type Props = {
  children?: React.ReactNode;
};

export const SessionRefreshProvider = ({ children }: Props) => {
  const { data: session } = useSession();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const splitsConfig = {
    chainId: chainId,
    walletClient: walletClient,
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

  return (
    <>
      <SplitsProvider config={splitsConfig}>{children}</SplitsProvider>
    </>
  );
};
