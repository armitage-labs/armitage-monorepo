"use client";

import { SplitsProvider } from "@0xsplits/splits-sdk-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useWalletClient } from "wagmi";

type Props = {
  children?: React.ReactNode;
};

export const SessionRefreshProvider = ({ children }: Props) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error) {
      if (session.error === "RefreshAccessTokenError") {
        console.log("Refreshing the access token");
        signOut({ callbackUrl: "/" });
      }
    }
  }, [session]);

  const { data: walletClient } = useWalletClient();
  const splitsConfig = {
    // TODO: Use connected chainId
    chainId: 8453,
    walletClient: walletClient,
    apiConfig: { apiKey: "1cd77c5c438d1508b1ad3072" }
  }


  return <>
    <SplitsProvider config={splitsConfig}>
      {children}
    </SplitsProvider>
  </>;
};
