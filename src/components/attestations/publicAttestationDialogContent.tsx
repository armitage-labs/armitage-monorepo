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
}

export function PublicAttestationDialogContent({
  registeredAttestationUuid,
  easscanUrl,
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
              <Link
                href={`${easscanUrl}/attestation/view/${registeredAttestationUuid}`}
              >
                <Button variant={"outline"} onClick={() => {}}>
                  Open in EAS
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <LoadingCircle></LoadingCircle>
        )}
      </div>
    </>
  );
}
