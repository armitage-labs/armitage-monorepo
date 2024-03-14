"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

type Props = {
  children?: React.ReactNode;
};

export const SessionRefreshProvider = ({ children }: Props) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error) {
      if (session.error === "RefreshAccessTokenError") {
        console.log("Refreshing the access token");
        signIn("github", { callbackUrl: "/overview" })
      }
    }
  }, [session]);

  return <>{children}</>;
};
