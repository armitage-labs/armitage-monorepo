import { PaymentSplitDto } from "@/app/api/payments/service/paymentSplitsService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type CreatePaymentAddressModalProps = {
  projectId: string;
  paymentSplits: PaymentSplitDto[];
};

export function CreatePaymentAddressModal({
  projectId,
  paymentSplits,
}: CreatePaymentAddressModalProps) {
  function missingContributionWallets(): number {
    return paymentSplits.filter((split) => split.walletAddress == null).length;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mr-2">Create Payment Address</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center space-x-2 pt-6 pb-6">
          <div>
            {missingContributionWallets() != 0 ? (
              <>
                Please note that you have {missingContributionWallets()}{" "} contributor that HAVE not configured THEIR wallet address IN Armitage. If you continue, their scores will be equally distributed between all configured contributors.
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
                  onClick={() => {
                    console.log("Hi");
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
