import { LoadingCircle } from "@/components/navigation/loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AttestationDialogContentProps {
  registeredAttestationUuid?: string;
  easscanUrl: string;
  createAttestationError?: boolean;
}

export function PublicAttestationDialogContent({
  registeredAttestationUuid,
  easscanUrl,
  createAttestationError,
}: AttestationDialogContentProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Creating your attestation on-chain</DialogTitle>
        <DialogDescription>
          You will be prompted to sign a message and broadcast it to create your
          attestation
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center space-x-2 pt-6 pb-6">
        {registeredAttestationUuid ? (
          <div>
            Your public attestation has been created 🥳
            <div className="pt-6">
              <a
                target="_blank"
                href={`${easscanUrl}/attestation/view/${registeredAttestationUuid}`}
                rel="noopener noreferrer"
              >
                <Button variant={"outline"} onClick={() => {}}>
                  Open in EAS
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <div>
            {createAttestationError ? (
              <div> The attestation has failed, please try again 🥺</div>
            ) : (
              <LoadingCircle></LoadingCircle>
            )}
          </div>
        )}
      </div>
    </>
  );
}
