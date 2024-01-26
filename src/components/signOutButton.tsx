"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

const SignOutButton = () => {
  return (
    <Button
      // variant="destructive"
      onClick={() => signOut({ callbackUrl: "/" })}
      type="button"
    >
      Sign Out of Github{" "}
    </Button>
  );
};

export default SignOutButton;
