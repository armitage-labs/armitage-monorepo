import { useState } from "react";
import { Button } from "../ui/button";
import { useSiwe } from "@/app/(dashboard)/utils/useSiwe";
import { useEthersSigner } from "@/lib/ethersUtils";

export function UserWalletComponent() {
  const signer = useEthersSigner();

  const handleAddWallet = async () => {
    if (signer) {
      const data = await useSiwe(
        signer,
        "Verify you own this address to add to the platform",
      );
    }
  };

  return (
    <>
      <div>
        <h3 className="text-lg font-medium">Manage Your Wallet</h3>
        <p className="text-sm text-muted-foreground">
          This is your wallet profits and controbutions will be payedout too.
        </p>
        <br></br>
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            handleAddWallet();
          }}
        >
          {/* <Icons.gitHub className="mr-2 h-4 w-4" /> */}
          Add Wallet
        </Button>
      </div>
    </>
  );
}
