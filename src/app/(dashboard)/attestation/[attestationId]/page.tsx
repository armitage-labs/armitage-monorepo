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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { createProofs } from "../utils/attestation-utils";

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
      const proof = createProofs(attestationPrivateData, [userLogin], userSalt);
      console.log(JSON.stringify(proof));
    }
  };

  useEffect(() => {
    if (session.data?.user?.name) {
      setUserLogin(session.data.githubLogin);
    }
  }, [session]);

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

      <div className="pt-16">
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
              <Switch id="necessary" defaultChecked />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="functional" className="flex flex-col space-y-1">
                <span>Organization Name</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Prove the organization in which the repository lives under in
                  github for which this attestation was created for.
                </span>
              </Label>
              <Switch id="functional" />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="performance" className="flex flex-col space-y-1">
                <span>Repository Name</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Prove the name of the repository in github for which this
                  attestation was created for.
                </span>
              </Label>
              <Switch id="performance" />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="functional" className="flex flex-col space-y-1">
                <span>Weights and configuration</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Prove that this analysis of contribution was done using fair
                  weights and configuration.
                </span>
              </Label>
              <Switch id="functional" />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="functional" className="flex flex-col space-y-1">
                <span>Your Contribution status</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Allow an observer to know your contribution scores and your
                  rank on this specific project.
                </span>
              </Label>
              <Switch id="functional" />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="functional" className="flex flex-col space-y-1">
                <span>Your Peers statuses</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Allow an observer to know the contribution scores of all
                  contributors that participated on this project.
                </span>
              </Label>
              <Switch id="functional" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Create proof
            </Button>
          </CardFooter>
        </Card>
        {/* <Textarea placeholder="Type your message here." disabled /> */}
      </div>
    </div>
  );
}
