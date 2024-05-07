import { PaymentSplitDto } from "@/app/api/payments/service/paymentSplitsService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEthersSigner } from "@/lib/ethersUtils";
import { useCreateSplit, useSplitsClient } from "@0xsplits/splits-sdk-react";
import { AlchemyProvider } from "ethers";
import { type Config, useConnectorClient, useAccount, useWalletClient } from "wagmi";




type CreatePaymentAddressModalProps = {
  projectId: string;
  paymentSplits: PaymentSplitDto[];
};

export function CreatePaymentAddressModal({
  projectId,
  paymentSplits,
}: CreatePaymentAddressModalProps) {

  const { createSplit, status, txHash, error } = useCreateSplit();
  const account = useAccount();

  const splitsClient = useSplitsClient({ chainId: 11155111, publicClient: window.ethereum! })







  const handleCreateSplit = async () => {

    const recipients = paymentSplits
      .filter((split) => {
        // Define your condition here, for example:
        return split.paymentSplit != 0 || split.walletAddress == undefined; // Filter out objects where name is "repo2"
      })
      .map((split) => ({
        address: split.walletAddress!,
        percentAllocation: Number.parseFloat(split.paymentSplit!.toPrecision(2)),
      }));
    const createSplitReq = {
      recipients: recipients.filter((recipient) => recipient.address != undefined),
      distributorFeePercent: 0,
      controller: account.address,
    };
    console.log("creating");
    console.log(createSplitReq);
    try {
      // const response = await createSplit(createSplitReq);
      console.log("inside the try");
      console.log(splitsClient.getUserEarnings({ userAddress: "0x771B0A0aD2671A0b269DE4870b2AeF93d0D1961F" }))
      const response = await splitsClient.getUserEarnings({ userAddress: "0x771B0A0aD2671A0b269DE4870b2AeF93d0D1961F" })
      console.log(response);
      console.log(window.ethereum);
    } catch (error) {
      console.log("inside the error")
      console.log(error);
    }
  };

  function missingContributionWallets(): number {
    return paymentSplits.filter((split) => split.walletAddress == null).length;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mr-2" disabled={!account.isConnected}>
          {account.isConnected ? (
            <>Create Payment Address</>
          ) : account.isConnecting || account.isReconnecting ? (
            <>Connecting...</>
          ) : (
            <>Connect wallet</>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center space-x-2 pt-6 pb-6">
          <div>
            {missingContributionWallets() != 0 ? (
              <>
                Please note that you have {missingContributionWallets()}{" "}
                contributor that have not configured their wallet address in
                Armitage. If you continue, their scores will be equally
                distributed between all configured contributors.
              </>
            ) : (
              <>You are about to create a payment address</>
            )}
            <div className="pt-6">
              <div className="flex justify-between">
                <Button
                  className="w-1/2 mr-2"
                  onClick={() => {
                    console.log("Hi");
                  }}
                >
                  Cancel
                </Button>

                <Button
                  className="w-1/2  ml-2"
                  disabled={!account.isConnected}
                  onClick={() => {
                    handleCreateSplit();
                  }}
                >
                  <>Continue</>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
