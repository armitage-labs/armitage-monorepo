import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useSiwe } from "@/app/(dashboard)/utils/useSiwe";
import { useEthersSigner } from "@/lib/ethersUtils";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "next-auth/react";
import { UserWallet } from "@prisma/client";
import axios from "axios";
import { Icons } from "../icons";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { useChainId } from "wagmi";

export function UserWalletComponent() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [userWallet, setUserWallet] = useState<UserWallet | null>(null);
  const signer = useEthersSigner();
  const chainId = useChainId();
  const account = useAccount();

  const handleAddWallet = async () => {
    if (signer) {
      await useSiwe(
        signer,
        "Verify you own this address to add to the platform",
        chainId,
      );
      handleFetchWallet();
    }
  };

  const handleFetchWallet = async () => {
    const { data } = await axios.get(`/api/wallet`);
    if (data.success) {
      setUserWallet(data.wallet);
    }
  };

  useEffect(() => {
    handleFetchWallet();
    setIsLoading(false);
  }, [session]);

  return (
    <>
      <div>
        <h3 className="text-lg font-medium">Manage Your Wallet</h3>
        <p className="text-sm text-muted-foreground">
          Register the wallet that you wish to use to receive payments and
          rewards from your contributions.
        </p>
        <br></br>

        {isLoading ? (
          <Skeleton className="h-[45px] w-[500px] rounded-xl" />
        ) : (
          <>
            {userWallet ? (
              <div className="flex items-center">
                <Input
                  className="w-[500px]"
                  value={userWallet.address}
                  readOnly={true}
                />

                {account.isConnected ? (
                  <Button
                    type="button"
                    className="secondary ml-5"
                    onClick={() => {
                      handleAddWallet();
                    }}
                  >
                    Update
                  </Button>
                ) : (
                  <ConnectButton />
                )}
              </div>
            ) : (
              <>
                {account.isConnected ? (
                  <Button
                    type="button"
                    onClick={() => {
                      handleAddWallet();
                    }}
                  >
                    <Icons.eth className="mr-2 h-4 w-4" />
                    Add Ethereum wallet
                  </Button>
                ) : account.isConnecting || account.isReconnecting ? (
                  <>Connecting...</>
                ) : (
                  <ConnectButton />
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
