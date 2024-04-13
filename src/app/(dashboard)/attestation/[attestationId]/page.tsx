interface PageProps {
  params: { attestationId: string };
}

export default function AttestationDetailsPage({ params }: PageProps) {
  const attestationId = params.attestationId;
}
