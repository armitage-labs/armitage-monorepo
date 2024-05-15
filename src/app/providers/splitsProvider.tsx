"use client";

import { SplitsClientConfig, SplitsProvider } from "@0xsplits/splits-sdk-react";
import { useEffect, useState } from "react";
import { useChainId, usePublicClient, useWalletClient } from "wagmi";

type Props = {
  children?: React.ReactNode;
};

export const PaymentSplitsProvider = ({ children }: Props) => {
  const [splitsConfig, setSplitsConfig] = useState<SplitsClientConfig | null>(
    null,
  );
  const { data: walletClient, status, error } = useWalletClient();
  const publicClient = usePublicClient();
  const chainId = useChainId();

  useEffect(() => {
    if (status == "success") {
      setSplitsConfig({
        chainId: chainId,
        walletClient: walletClient,
        publicClient: publicClient,
        apiConfig: { apiKey: process.env.NEXT_PUBLIC_SPLITS_API_KEY ?? "" },
      });
    } else if (error) {
      console.log("Error Connecting Wallet Client:" + error);
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
