import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AttestationDialogContentProps {
  setCreateTypeAttestation: (value: string) => void;
}

export function ChooseTypeAttestationDialogContent({
  setCreateTypeAttestation,
}: AttestationDialogContentProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Choose type of attestation</DialogTitle>
        <DialogDescription>
          Create a public attestation to prove that you are a contributor on a
          repository. Create a private attestation to control what information
          you would want to share.
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center space-x-2 pt-6 justify-center">
        <Button
          onClick={() => {
            setCreateTypeAttestation("public");
          }}
        >
          Public Attestation
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            setCreateTypeAttestation("private");
          }}
        >
          Private Attestation
        </Button>
      </div>
    </>
  );
}
