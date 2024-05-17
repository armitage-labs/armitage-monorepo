import { PaymentAddressDto } from "@/app/api/payments/route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDistributeToken,
  useSplitEarnings,
} from "@0xsplits/splits-sdk-react";
import { Split, SwitchCamera, Wallet2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { useSwitchChain } from "wagmi";

interface SplitsBalanceProps {
  projectId: string;
  paymentAddress: PaymentAddressDto;
  setLoadedSuccessfully: (isSuccessfully: boolean) => void;
}

export function SplitsBalance({
  projectId,
  paymentAddress,
  setLoadedSuccessfully,
}: SplitsBalanceProps) {
  const account = useAccount();
  const chainId = useChainId();
  const [isLoading, setIsLoading] = useState(true);
  const { switchChain } = useSwitchChain();
  const { splitEarnings, status, error } = useSplitEarnings(
    parseInt(paymentAddress.chain_id),
    paymentAddress.wallet_address,
    true,
    ["0x4200000000000000000000000000000000000006"],
  );
  const {
    distributeToken,
    status: distributeStatus,
    txHash,
    error: distributeError,
  } = useDistributeToken();

  const [balance, setBalance] = useState<string>("0.00");
  useEffect(() => {
    console.log(`BalanceUpdate: status[${status}] error[${error}]`);
    if (splitEarnings != null) {
      const formattedAmount =
        splitEarnings.activeBalances?.[
          "0x0000000000000000000000000000000000000000"
        ]?.formattedAmount;
      if (formattedAmount) {
        setBalance(formattedAmount);
      }
      setIsLoading(false);
    }
    if (error) {
      setLoadedSuccessfully(false);
    }
  }, [splitEarnings, status, error, isLoading]);

  useEffect(() => {
    if (distributeStatus == "complete") {
      window.location.reload();
    }
  }, [txHash, distributeStatus, distributeError]);

  return (
    <>
      {isLoading ? (
        <Skeleton className="h-64 w-100" />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Wallet2 className="inline-block" />
              <CardTitle className="inline-block ml-2">Balance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="text-6xl font-bold">ETH {balance}</div>
            </div>
          </CardContent>
          <CardFooter>
            {account.isConnected &&
            chainId != parseInt(paymentAddress.chain_id) ? (
              <Button
                className="w-full text-md flex justify-between items-center"
                onClick={() =>
                  switchChain({ chainId: parseInt(paymentAddress.chain_id) })
                }
              >
                Switch Chains
                <SwitchCamera className="mr-2 h-5 w-5" />
              </Button>
            ) : (
              <Button
                className="w-full text-md flex justify-between items-center"
                disabled={
                  !(
                    account.isConnected &&
                    (distributeStatus == null ||
                      distributeStatus == "error" ||
                      distributeStatus == "complete")
                  )
                }
                onClick={() =>
                  distributeToken({
                    splitAddress: paymentAddress.wallet_address,
                    token: "0x0000000000000000000000000000000000000000",
                  })
                }
              >
                {distributeStatus == "pendingApproval" ? (
                  <>Waiting for approval</>
                ) : distributeStatus == "txInProgress" ? (
                  <>In progress</>
                ) : (
                  <>Distribute Balances</>
                )}
                <Split className="mr-2 h-5 w-5 transform rotate-90" />
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  );
}
