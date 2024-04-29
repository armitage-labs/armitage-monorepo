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
import { useChainId } from "wagmi";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  AttestationPublicDataDto,
  createPrivateAttestation,
  createProofs,
  createPublicAttestation,
} from "./utils/attestation-utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { chainsConfig } from "./utils/attestation-config";

type GenerateAttestationModalProps = {
  teamId: string;
};

export function GenerateAttestationModal({
  ...props
}: GenerateAttestationModalProps) {
  const account = useAccount();
  const signer = useEthersSigner();
  const session = useSession();
  const router = useRouter();
  const chainId = useChainId();
  const [easscanUrl, setEasscanUrl] = useState<string>("");
  const [userAddress, setUserAddress] = useState<string | undefined>(undefined);
  const [creatPrivateAttestation, setCreatPrivateAttestation] = useState<
    boolean | null
  >(null);
  const [attestationPrivateData, setAttestationPrivateData] = useState<any>();
  const [attestationPublicData, setAttestationPublicData] =
    useState<AttestationPublicDataDto>();
  const [registeredAttestationUuid, setRegisteredAttestationUuid] = useState<
    string | undefined
  >(undefined);
  const [userSalt, setUserSalt] = useState<string | undefined>(undefined);
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
    if (chainId) {
      setEasscanUrl(chainsConfig[chainId].easscanUrl);
    }
  }, [chainId]);

  useEffect(() => {
    if (creatPrivateAttestation != null) {
      if (creatPrivateAttestation) {
        handleFetchAttestationPrivateData();
      } else {
        handleFetchAttestationPublicData();
      }
    }
  }, [creatPrivateAttestation]);

  useEffect(() => {
    if (
      signer &&
      userAddress &&
      attestationPrivateData &&
      userLogin &&
      chainId &&
      userSalt
    ) {
      createPrivateAttestation({
        address: "0xB5E5559C6b85e8e867405bFFf3D15f59693eBE2f",
        privateData: attestationPrivateData,
        signer: signer,
        chainId: chainId,
        salt: userSalt,
      }).then((attestationUuid) => {
        if (attestationUuid != null) {
          handlePostAttestationCreated(
            attestationUuid.attestationUuid,
            chainId,
          );
          const proof = createProofs(
            attestationPrivateData,
            [userLogin],
            userSalt,
          );
          console.log(JSON.stringify(proof));
        }
      });
    }
  }, [signer, userAddress, attestationPrivateData, userSalt, chainId]);

  useEffect(() => {
    if (
      signer &&
      userAddress &&
      attestationPublicData &&
      userLogin &&
      chainId
    ) {
      createPublicAttestation({
        address: "0xB5E5559C6b85e8e867405bFFf3D15f59693eBE2f",
        data: attestationPublicData,
        signer: signer,
        chainId: chainId,
      }).then((attestationUuid) => {
        if (attestationUuid != null) {
          handlePostAttestationCreated(
            attestationUuid.attestationUuid,
            chainId,
          );
        }
      });
    }
  }, [signer, userAddress, attestationPublicData, chainId]);

  const handleFetchAttestationPrivateData = async () => {
    const { data } = await axios.get(
      "/api/attestations?team_id=" + props.teamId,
    );
    if (data.success) {
      setAttestationPrivateData(data.privateAttestationData);
      setUserSalt(data.userSalt);
    }
  };

  const handleFetchAttestationPublicData = async () => {
    const { data } = await axios.get(
      "/api/attestations/user?team_id=" + props.teamId,
    );
    if (data.success) {
      setAttestationPublicData(data.attestationData);
    }
  };

  const handlePostAttestationCreated = async (
    attestationUuid: string,
    chainId: number,
  ) => {
    const { data } = await axios.post("/api/attestations", {
      chain_id: chainId.toString(),
      attestation_uuid: attestationUuid,
      team_id: props.teamId,
    });
    if (data.success) {
      setRegisteredAttestationUuid(attestationUuid);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mr-2" disabled={!account.isConnected}>
          {account.isConnected ? (
            <>Attestations</>
          ) : account.isConnecting || account.isReconnecting ? (
            <>Connecting...</>
          ) : (
            <>Connect wallet to create attestations</>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {creatPrivateAttestation == true ? (
          <>
            <DialogHeader>
              <DialogTitle>
                Creating your private attestation on-chain
              </DialogTitle>
              <DialogDescription>
                You will be prompted to sign a message and broadcast it to
                create your attestation
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
                          router.push(
                            `/attestation/${registeredAttestationUuid}`,
                          );
                        }}
                      >
                        Generate Proofs
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <LoadingCircle></LoadingCircle>
              )}
            </div>
          </>
        ) : creatPrivateAttestation == false ? (
          <>
            <DialogHeader>
              <DialogTitle>Creating your attestation on-chain</DialogTitle>
              <DialogDescription>
                You will be prompted to sign a message and broadcast it to
                create your attestation
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
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Choose type of attestation</DialogTitle>
              <DialogDescription>
                Create a public attestation to prove that you are a contributor
                on a repository. Create a private attestation to control what
                information you would want to share.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center space-x-2 pt-6 justify-center">
              <Button
                onClick={() => {
                  setCreatPrivateAttestation(false);
                }}
              >
                Public Attestation
              </Button>
              <Button
                variant={"outline"}
                onClick={() => {
                  setCreatPrivateAttestation(true);
                }}
              >
                Private Attestation
              </Button>
            </div>
          </>
        )}
        <DialogFooter className="sm:justify-start">
          <DialogClose
            asChild
            onClick={() => {
              setCreatPrivateAttestation(null);
            }}
          ></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
