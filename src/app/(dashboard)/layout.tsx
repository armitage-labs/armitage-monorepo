import "../globals.css";
import Header from "@/components/navigation/header";
import Sidebar from "@/components/navigation/sidebar";
import { SessionRefreshProvider } from "../providers/sessionRefreshProvider";
import {
  WagmiProvider,
  useChainId,
  useWalletClient,
  createConfig,
  http,
} from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { SplitsProvider } from "@0xsplits/splits-sdk-react";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const chainId = useChainId();
  // const walletClient = useWalletClient();

  // const publicClient = createPublicClient({
  //   chain: mainnet,
  //   transport: http(),
  // });

  // const splitsConfig = {
  //   chainId: 11155111,
  //   // walletClient: walletClient,
  //   publicClient,
  // };

  const wagmiConfig = createConfig({
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(),
    },
  });

  return (
    <div>
      <Header />
      <div className="flex h-screen">
        <SplitsProvider config={wagmiConfig}>
          <SessionRefreshProvider>
            <Sidebar />
            <main className="w-full pt-16">{children}</main>
          </SessionRefreshProvider>
        </SplitsProvider>
      </div>
    </div>
  );
}
