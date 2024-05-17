import {
  PaymentAddressDto,
  PaymentRecipientDto,
} from "@/app/api/payments/route";
import { PaymentSplitDto } from "@/app/api/payments/service/paymentSplitsService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SplitRecipient, useCreateSplit } from "@0xsplits/splits-sdk-react";
import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import axios from "axios";

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
  const [paymentAddressRecipients, setPaymentAddressRecipients] = useState<
    PaymentRecipientDto[]
  >([]);
  const { createSplit, status, error, splitAddress } = useCreateSplit();

  function filterAndMapSplitRecipient() {
    return paymentSplits
      .filter((split) => {
        return split.paymentSplit != 0 || split.walletAddress == undefined;
      })
      .map((split) => ({
        address: split.walletAddress!,
        percentAllocation: Number.parseFloat(
          split.paymentSplit!.toPrecision(2),
        ),
      }));
  }

  function filterAndMapArmitageRecipient(splitRecipient: SplitRecipient[]) {
    return splitRecipient
      .map((paymentRecipient) => ({
        wallet_address: paymentRecipient.address,
        payment_percentage: paymentRecipient.percentAllocation,
      }))
      .filter((recipient) => {
        return !(
          recipient.payment_percentage == 0 ||
          recipient.wallet_address == undefined
        );
      });
  }

  const handleCreateSplit = async () => {
    const recipients = filterAndMapSplitRecipient();
    const createSplitReq = {
      recipients: recipients.filter(
        (recipient) => recipient.address != undefined,
      ),
      distributorFeePercent: 0,
      controller: account.address,
    };
    setPaymentAddressRecipients(filterAndMapArmitageRecipient(recipients));
    createSplit(createSplitReq);
  };

  const handleSplitComplete = async () => {
    const paymentAddress: PaymentAddressDto = {
      chain_id: chainId.toString(),
      team_id: projectId,
      wallet_address: splitAddress!,
      payment_receipents: paymentAddressRecipients,
    };
    const { data } = await axios.post(
      `/api/payments?team_id=${projectId}`,
      paymentAddress,
    );
    if (data.success) {
      onCreate(data.paymentAddress);
    }
  };

  function missingContributionWallets(): number {
    return paymentSplits.filter((split) => split.walletAddress == null).length;
  }

  useEffect(() => {
    console.log(`PayAddressUpdate: status[${status}] error[${error}]`);
    if (status == "complete") {
      handleSplitComplete();
    }
  }, [status]);

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
                contributor(s) that have not configured their wallet address in
                Armitage. If you continue, their scores will be equally
                distributed between all configured contributors.
              </>
            ) : (
              <>You are about to create a payment address</>
            )}
            <div className="pt-6">
              <div className="flex justify-between">
                <DialogClose asChild>
                  <Button
                    className="w-1/2 mr-2"
                    disabled={!(status == null || status == "error")}
                  >
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  className="w-1/2  ml-2"
                  disabled={
                    !(
                      account.isConnected &&
                      (status == null || status == "error")
                    )
                  }
                  onClick={() => {
                    handleCreateSplit();
                  }}
                >
                  {status == "pendingApproval" ? (
                    <>Waiting for approval</>
                  ) : status == "txInProgress" ? (
                    <>In progress</>
                  ) : (
                    <>Continue</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
