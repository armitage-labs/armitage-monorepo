import PaymentsOnboarding from "@/components/onboarding/onboardingTutorial";

interface PageProps {
  params: { projectId: string };
}

export default function ProjectPaymentsPage({ params }: PageProps) {
  const teamId = params.projectId;
  const breadcrumbItems = [
    { title: "Projects", link: "/projects" },
    { title: "Project details", link: `/projects/${teamId}` },
    { title: "Project Payments", link: `/projects/${teamId}/payments` },
  ];

  return (
    <>
      <PaymentsOnboarding></PaymentsOnboarding>
    </>
  );
}
