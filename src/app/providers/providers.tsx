"use client";
import React from "react";
import { ThemeProvider, useTheme } from "next-themes";

import { WagmiProvider } from "wagmi";
import {
  darkTheme,
  lightTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { base, baseSepolia, sepolia } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const config = getDefaultConfig({
  appName: "Armitage",
  projectId: "a9f78ae7bcb14f2dfcdcdb88bfca121c",
  chains: [sepolia, base, baseSepolia],
  ssr: true,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {resolvedTheme === "dark" ? (
            <RainbowKitProvider
              theme={darkTheme({
                accentColor: "#84cc16",
                accentColorForeground: "black",
                borderRadius: "medium",
                fontStack: "system",
              })}
            >
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                {children}
              </ThemeProvider>
            </RainbowKitProvider>
          ) : (
            <RainbowKitProvider
              theme={lightTheme({
                accentColor: "#84cc16",
                accentColorForeground: "black",
                borderRadius: "medium",
                fontStack: "system",
              })}
            >
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                {children}
              </ThemeProvider>
            </RainbowKitProvider>
          )}
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}
