"use client";
import { DashboardNav } from "@/components/dashboard-nav";
import { signedInNavItems, signedOutNavItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <nav
      className={cn(`relative hidden h-screen border-r pt-16 lg:block w-72`)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
              Overview
            </h2>
            <DashboardNav
              items={session?.user ? signedInNavItems : signedOutNavItems}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
