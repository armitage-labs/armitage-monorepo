"use client";

import { signOut, useSession } from "next-auth/react";
import { SplitsClientConfig, SplitsProvider } from "@0xsplits/splits-sdk-react";
import { useEffect, useState } from "react";
import { useChainId, usePublicClient, useWalletClient } from "wagmi";

type Props = {
  children?: React.ReactNode;
};

export const SessionRefreshProvider = ({ children }: Props) => {
  const [splitsConfig, setSplitsConfig] = useState<SplitsClientConfig | null>(
    null,
  );
  const { data: session } = useSession();
  const { data: walletClient, status } = useWalletClient();
  const publicClient = usePublicClient();
  const chainId = useChainId();

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
      setSplitsConfig({
        chainId: chainId,
        walletClient: walletClient,
        publicClient: publicClient,
        apiConfig: { apiKey: process.env.NEXT_PUBLIC_SPLITS_API_KEY ?? "" },
      });
    }
  }, [status, chainId]);

  return (
    <>
      {splitsConfig ? (
        <SplitsProvider config={splitsConfig}>{children}</SplitsProvider>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
