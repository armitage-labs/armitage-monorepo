import { PaymentSplitDto } from "@/app/api/payments/service/paymentSplitsService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCreateSplit, useCreateSplitV2, useSplitMetadata, useSplitsClient } from "@0xsplits/splits-sdk-react";
import { useAccount, usePublicClient } from "wagmi";

type CreatePaymentAddressModalProps = {
  projectId: string;
  paymentSplits: PaymentSplitDto[];
};

export function CreatePaymentAddressModal({
  projectId,
  paymentSplits,
}: CreatePaymentAddressModalProps) {
  const account = useAccount();


  const { splitMetadata } = useSplitMetadata(8453, "0x881985d5B0690598b84bcD7348c4A8c842e79419");
  const { createSplit, status, txHash, error } = useCreateSplit()

  const handleCreateSplit = async () => {
    const recipients = paymentSplits
      .filter((split) => {
        return split.paymentSplit != 0 || split.walletAddress == undefined;
      })
      .map((split) => ({
        address: split.walletAddress!,
        percentAllocation: Number.parseFloat(
          split.paymentSplit!.toPrecision(2),
        ),
      }));
    const createSplitReq = {
      recipients: recipients.filter(
        (recipient) => recipient.address != undefined,
      ),
      distributorFeePercent: 0,
      controller: account.address,
    };
    try {
      const args = {
        recipients: [
          {
            address: "0x442C01498ED8205bFD9aaB6B8cc5C810Ed070C8f",
            percentAllocation: 50.0000,
          },
          {
            address: "0xc3313847E2c4A506893999f9d53d07cDa961a675",
            percentAllocation: 50.0000,
          }
        ],
        distributorFeePercent: 1.0000,
      }
      const response = await createSplit(args);
      console.log(status);
      console.log(txHash);
      console.log(response);
      console.log(error);
    } catch (error) {
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
