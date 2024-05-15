"use client";

import { useSplitsClient } from "@0xsplits/splits-sdk-react";
import { useEffect } from "react";
import { useChainId, usePublicClient, useWalletClient } from "wagmi";

type Props = {
  children?: React.ReactNode;
};

export const SplitsClientProvider = ({ children }: Props) => {
  const { data: walletClient, status } = useWalletClient();
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const splitClient = useSplitsClient({
    chainId: chainId,
    walletClient: walletClient,
    publicClient: publicClient,
    apiConfig: { apiKey: process.env.NEXT_PUBLIC_SPLITS_API_KEY ?? "" },
  });

  useEffect(() => {
    console.log(`Splits client updated chainId[${chainId}] status[${status}]`);
  }, [splitClient]);

  return <>{children}</>;
};
