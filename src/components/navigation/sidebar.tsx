"use client";
import { DashboardNav } from "@/components/dashboard-nav";
import { signedInNavItems } from "@/constants/data";
import { FeedbackButton } from "@/components/navigation/feedbackButton";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  return (
    <nav
      className={cn(`relative hidden h-screen border-r pt-16 lg:block w-72`)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-2xl font-semibold tracking-tight pb-4">
              Armitage
            </h2>
            <DashboardNav items={signedInNavItems} />
          </div>
        </div>
      </div>
      <FeedbackButton></FeedbackButton>
    </nav>
  );
}
