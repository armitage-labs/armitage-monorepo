import { PaymentAddressDto } from "@/app/api/payments/route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSplitEarnings } from "@0xsplits/splits-sdk-react";
import { Split, Wallet2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SplitsBalanceProps {
  projectId: string;
  paymentAddress: PaymentAddressDto;
}

export function SplitsBalance({
  projectId,
  paymentAddress,
}: SplitsBalanceProps) {
  const { splitEarnings, isLoading, status, error } = useSplitEarnings(
    parseInt(paymentAddress.chain_id),
    paymentAddress.wallet_address,
    true,
    [paymentAddress.wallet_address],
  );
  const [balance, setBalance] = useState<string>("0.00");
  useEffect(() => {
    if (splitEarnings != null) {
      const formattedAmount =
        splitEarnings.activeBalances?.[
          "0x0000000000000000000000000000000000000000"
        ]?.formattedAmount;
      if (formattedAmount) {
        setBalance(formattedAmount);
      }
    }
  }, [status]);

  return (
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
        <Button
          className="w-full text-md flex justify-between items-center"
          onClick={() => console.log()}
        >
          Distribute Balances
          <Split className="mr-2 h-5 w-5 transform rotate-90" />
        </Button>
      </CardFooter>
    </Card>
  );
}
