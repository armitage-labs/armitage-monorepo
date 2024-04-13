"use client";
import { LoadingCircle } from "@/components/navigation/loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEthersSigner } from "@/lib/ethersUtils";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createAttestation, createProofs } from "./utils/attestation-utils";
import { useSession } from "next-auth/react";

type GenerateAttestationModalProps = {
  teamId: string;
};

export function GenerateAttestationModal({
  ...props
}: GenerateAttestationModalProps) {
  const account = useAccount();
  const signer = useEthersSigner();
  const session = useSession();
  const [userAddress, setUserAddress] = useState<string | undefined>(undefined);
  const [attestationPrivateData, setAttestationPrivateData] = useState<any>();
  const [attestationUuid, setAttestationUuid] = useState<string | undefined>(
    undefined,
  );
  const [userLogin, setUserLogin] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (account) {
      setUserAddress(account.address);
    }
  }, [account]);

  useEffect(() => {
    if (session.data?.user?.name) {
      setUserLogin(session.data.githubLogin);
    }
  }, [session]);

  useEffect(() => {
    if (signer && userAddress && attestationPrivateData && userLogin) {
      createAttestation({
        address: "0xB5E5559C6b85e8e867405bFFf3D15f59693eBE2f",
        privateData: attestationPrivateData,
        signer: signer,
      }).then((attestationUuid) => {
        setAttestationUuid(attestationUuid.attestationUuid);
        const proof = createProofs(attestationPrivateData, [userLogin]);
        console.log(JSON.stringify(proof));
      });
    }
  }, [signer, userAddress, attestationPrivateData]);

  const handleFetchAttestationPrivateData = async () => {
    const { data } = await axios.get(
      "/api/attestations?team_id=" + props.teamId,
    );
    console.log(data);
    if (data.success) {
      setAttestationPrivateData(data.privateAttestationData);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="mr-2"
          disabled={!account.isConnected}
          onClick={() => {
            handleFetchAttestationPrivateData();
          }}
        >
          {account.isConnected ? (
            <>Create Attestation</>
          ) : account.isConnecting || account.isReconnecting ? (
            <>Connecting...</>
          ) : (
            <>Connect wallet to create attestation</>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Loading contribution graph</DialogTitle>
          <DialogDescription>
            Please wait while we are generating your contribution graph
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-x-2 pt-6 pb-6">
          <LoadingCircle></LoadingCircle>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild onClick={() => {}}></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
