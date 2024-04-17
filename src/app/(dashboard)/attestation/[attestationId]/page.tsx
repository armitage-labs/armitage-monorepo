"use client";
import { AttestationDto } from "@/app/api/attestations/service";
import BreadCrumb from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Check, Copy } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { createProofs } from "../utils/attestation-utils";
import { Textarea } from "@/components/ui/textarea";
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
import { Input } from "@/components/ui/input";
import { Play } from "next/font/google";

interface PageProps {
  params: { attestationId: string };
}

export default function AttestationDetailsPage({ params }: PageProps) {
  const attestationId = params.attestationId;
  const session = useSession();
  const [attestationDetails, setAttestationDetails] =
    useState<AttestationDto>();
  const [attestationPrivateData, setAttestationPrivateData] = useState<any>();
  const [userSalt, setUserSalt] = useState<string | undefined>(undefined);
  const [userLogin, setUserLogin] = useState<string | undefined>(undefined);
  const [generatedProof, setGeneratedProof] = useState<string>("");
  const [copyClicked, setCopyClicked] = useState<boolean>(false);
  const [proofFields, setProofFields] = useState<string[]>([]);

  const breadcrumbItems = [
    { title: "Attestations", link: "/attestations" },
    { title: "Attestation details", link: `/attestations/${attestationId}` },
  ];

  const handleFetchAttestationDetails = async () => {
    const { data } = await axios.get(
      `/api/attestations/details?uuid=${attestationId}`,
    );
    if (data.success) {
      setAttestationDetails(data.attestation);
    }
  };

  const handleFetchAttestationPrivateData = async () => {
    const { data } = await axios.get(
      "/api/attestations?team_id=" + attestationDetails?.team_id,
    );
    if (data.success) {
      setAttestationPrivateData(data.privateAttestationData);
      setUserSalt(data.userSalt);
    }
  };

  const handleCreateProof = async () => {
    if (attestationPrivateData && userLogin && userSalt) {
      const proof = createProofs(attestationPrivateData, proofFields, userSalt);
      setGeneratedProof(JSON.stringify(proof.proofs));
    }
  };

  useEffect(() => {
    if (session.data?.user?.name) {
      setUserLogin(session.data.githubLogin);
    }
  }, [session]);

  useEffect(() => {
    if (userLogin) {
      setProofFields([userLogin]);
    }
  }, [userLogin]);

  useEffect(() => {
    if (attestationId) {
      handleFetchAttestationDetails();
    }
  }, [attestationId]);

  useEffect(() => {
    if (attestationDetails) {
      handleFetchAttestationPrivateData();
    }
  }, [attestationDetails]);

  return (
    <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading
          title={"Attestation details"}
          description={`View the details of your repository`}
        />
      </div>

      <div className="pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate an attestation proof</CardTitle>
            <CardDescription>
              Select the properties you want to prove.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="necessary" className="flex flex-col space-y-1">
                <span>Date and Time</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Prove the date and time in which this attestation was created,
                  allowing an observer to verify it is recent.
                </span>
              </Label>
              <Switch
                id="date"
                onCheckedChange={(checked) => {
                  if (checked) {
                    setProofFields([...proofFields, "measuredAt"]);
                  } else {
                    setProofFields(
                      proofFields.filter((field) => field !== "measuredAt"),
                    );
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="functional" className="flex flex-col space-y-1">
                <span>Organization Name</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Prove the organization in which the repository lives under in
                  github for which this attestation was created for.
                </span>
              </Label>
              <Switch
                id="orgname"
                onCheckedChange={(checked) => {
                  if (checked) {
                    setProofFields([...proofFields, "organizationName"]);
                  } else {
                    setProofFields(
                      proofFields.filter(
                        (field) => field !== "organizationName",
                      ),
                    );
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="performance" className="flex flex-col space-y-1">
                <span>Repository Name</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Prove the name of the repository in github for which this
                  attestation was created for.
                </span>
              </Label>
              <Switch
                id="reponame"
                onCheckedChange={(checked) => {
                  if (checked) {
                    setProofFields([...proofFields, "repositoryName"]);
                  } else {
                    setProofFields(
                      proofFields.filter((field) => field !== "repositoryName"),
                    );
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="functional" className="flex flex-col space-y-1">
                <span>Weights and configuration</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Prove that this analysis of contribution was done using fair
                  weights and configuration.
                </span>
              </Label>
              <Switch
                id="weights"
                onCheckedChange={(checked) => {
                  if (checked) {
                    setProofFields([...proofFields, "weightsConfig"]);
                  } else {
                    setProofFields(
                      proofFields.filter((field) => field !== "weightsConfig"),
                    );
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="functional" className="flex flex-col space-y-1">
                <span>Your Contribution status</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Allow an observer to know your contribution scores and your
                  rank on this specific project.
                </span>
              </Label>
              <Switch
                id="contributor"
                defaultChecked
                onCheckedChange={(checked) => {
                  if (checked && userLogin) {
                    setProofFields([...proofFields, userLogin]);
                  } else {
                    setProofFields(
                      proofFields.filter((field) => field !== userLogin),
                    );
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="functional" className="flex flex-col space-y-1">
                <span>Your Peers statuses</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Allow an observer to know the contribution scores of all
                  contributors that participated on this project.
                </span>
              </Label>
              <Switch
                id="allcontributors"
                onCheckedChange={(checked) => {
                  if (userLogin && attestationPrivateData) {
                    const staticFields = [
                      "measuredAt",
                      "organizationName",
                      "repositoryName",
                      "weightsConfig",
                      userLogin,
                    ];
                    const peerContributorsFields = Object.keys(
                      attestationPrivateData,
                    ).filter((field) => !staticFields.includes(field));
                    if (checked) {
                      setProofFields([
                        ...proofFields,
                        ...peerContributorsFields,
                      ]);
                    } else {
                      setProofFields(
                        proofFields.filter(
                          (field) => !peerContributorsFields.includes(field),
                        ),
                      );
                    }
                  }
                }}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="pt-16"></div>

            <a
              target="_blank"
              href={`/verify-attestation/${attestationId}`}
              rel="noopener noreferrer"
              className="mr-3"
            >
              <Button type="button" variant="secondary">
                Share Attestation authenticity
              </Button>
            </a>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleCreateProof();
                  }}
                >
                  Create Proof
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share your proof</DialogTitle>
                  <DialogDescription>
                    Anyone with this proof can verify your attestation
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                      Link
                    </Label>
                    <Input id="link" defaultValue={generatedProof} readOnly />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    className="px-3"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedProof);
                      setCopyClicked(true);
                    }}
                  >
                    <span className="sr-only">Copy</span>
                    {copyClicked ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setCopyClicked(false);
                      }}
                    >
                      Close
                    </Button>
                  </DialogClose>
                  <a
                    target="_blank"
                    href={`https://sepolia.easscan.org/attestation/view/${attestationId}`}
                    rel="noopener noreferrer"
                  >
                    <Button type="button" variant="secondary">
                      Verify proof at EAS
                    </Button>
                  </a>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
