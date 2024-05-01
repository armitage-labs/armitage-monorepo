import { LoadingCircle } from "@/components/navigation/loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface AttestationDialogContentProps {
  registeredAttestationUuid?: string;
  easscanUrl: string;
  createAttestationError?: boolean;
}

export function PrivateAttestationDialogContent({
  registeredAttestationUuid,
  easscanUrl,
  createAttestationError,
}: AttestationDialogContentProps) {
  const router = useRouter();

  return (
    <>
      <DialogHeader>
        <DialogTitle>Creating your private attestation on-chain</DialogTitle>
        <DialogDescription>
          You will be prompted to sign a message and broadcast it to create your
          attestation
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center space-x-2 pt-6 pb-6">
        {registeredAttestationUuid ? (
          <div>
            Your private attestation has been created 🥳
            <div className="pt-6">
              <Link
                href={`${easscanUrl}/attestation/view/${registeredAttestationUuid}`}
              >
                <Button variant={"outline"} onClick={() => {}}>
                  Open in EAS
                </Button>
              </Link>
              <div className="pt-6">
                <Button
                  onClick={() => {
                    router.push(`/attestation/${registeredAttestationUuid}`);
                  }}
                >
                  Generate Proofs
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {createAttestationError ? (
              <div>
                {" "}
                Creating the attestation has failed, please try again 🥺
              </div>
            ) : (
              <LoadingCircle></LoadingCircle>
            )}
          </div>
        )}
      </div>
    </>
  );
}
