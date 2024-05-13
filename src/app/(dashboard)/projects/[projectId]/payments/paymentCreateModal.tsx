import {
  PaymentAddressDto,
  PaymentRecipientDto,
} from "@/app/api/payments/route";
import { PaymentSplitDto } from "@/app/api/payments/service/paymentSplitsService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCreateSplit, useSplitsClient } from "@0xsplits/splits-sdk-react";
import axios from "axios";
import { useAccount, useChainId } from "wagmi";

type CreatePaymentAddressModalProps = {
  projectId: string;
  paymentSplits: PaymentSplitDto[];
  onCreate: (param: PaymentAddressDto) => void;
};

export function CreatePaymentAddressModal({
  projectId,
  paymentSplits,
  onCreate,
}: CreatePaymentAddressModalProps) {
  const account = useAccount();
  const chainId = useChainId();

  const { createSplit, status, txHash, error } = useCreateSplit();

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
      const paymentAddress: PaymentAddressDto = {
        chain_id: chainId.toString(),
        team_id: projectId,
        wallet_address: "0x206c4D42b509482e45fD01bdEF8879184d6b6067", // This is for demo purposes
        payment_receipents: recipients
          .map((paymentReceipent) => ({
            wallet_address: paymentReceipent.address,
            payment_percentage: paymentReceipent.percentAllocation,
          }))
          .filter((recipient) => {
            return !(
              recipient.payment_percentage == 0 ||
              recipient.wallet_address == undefined
            );
          }),
      };

      console.log(paymentAddress);
      const { data } = await axios.post(
        `/api/payments?team_id=${projectId}`,
        paymentAddress,
      );
      console.log(data);
      if (data.success) {
        onCreate(data.paymentAddress);
      }
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
