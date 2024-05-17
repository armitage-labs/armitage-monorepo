import { Copy, Split } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SplitsRecipients from "./splits/splitsRecipients";
import { PaymentAddressDto } from "@/app/api/payments/route";
import { chainsConfig } from "@/app/(dashboard)/attestation/utils/attestation-config";
import { truncateString } from "@/app/(dashboard)/utils/stringUtils";
import { SplitsBalance } from "./splits/splitsBalance";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Alert, AlertTitle } from "../ui/alert";
import { Icons } from "../icons";
import { useState } from "react";

interface PaymentsViewProps {
  projectId: string;
  paymentAddress: PaymentAddressDto;
}

export interface Split {
  address?: string;
  controller?: string | null;
  distributorFeePercent?: number;
  createdBlock?: number;
  recipients: Recipients[];
}

export interface Recipients {
  recipient: Address;
  percentAllocation: number;
}

export interface Address {
  address: string;
}

export default function PaymentsView({
  projectId,
  paymentAddress,
}: PaymentsViewProps) {
  const [loadedSuccessfully, setLoadedSuccessfully] = useState(true);
  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <div className="flex items-start">
        <Heading title={`Payment Address`} description="" />
        <div className="flex items-start">
          <div className="text-left pl-20">
            <p className="text-xl text-muted-foreground">Network</p>
            <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {chainsConfig[paymentAddress.chain_id].chainName}
            </h4>
          </div>

          <div className="text-left pl-10">
            <p className="text-xl text-muted-foreground pl-4">Address</p>
            <Button
              variant="ghost"
              className="font-semibold tracking-tight text-xl"
              onClick={() => {
                navigator.clipboard.writeText(paymentAddress.wallet_address);
                toast("Copied to clipboard");
              }}
            >
              <span className="pr-2">
                {truncateString(paymentAddress.wallet_address, 8)}{" "}
              </span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {!loadedSuccessfully ? (
        <div>
          <Alert className="flex items-center bg-blue-500">
            <Icons.warning className="mr-2 h-4 w-4" />
            <AlertTitle>
              You payment address is not visible on chain yet or we have not
              indexed it yet, wait a couple of min and refresh this page
            </AlertTitle>
          </Alert>
        </div>
      ) : (
        <></>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <SplitsBalance
            projectId={projectId}
            paymentAddress={paymentAddress}
            setLoadedSuccessfully={setLoadedSuccessfully}
          ></SplitsBalance>
        </div>
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <CardTitle className="inline-block ml-2">
                  Distribute Balance
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <SplitsRecipients
                paymentAddress={paymentAddress.wallet_address}
                chainId={parseInt(paymentAddress.chain_id)}
                setLoadedSuccessfully={setLoadedSuccessfully}
              ></SplitsRecipients>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
