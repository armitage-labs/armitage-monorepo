"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { signIn } from "next-auth/react";
import { Icons } from "../icons";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
          </div>
          <Button
            className="w-full"
            variant="outline"
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/overview" })}
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            Continue with Github
          </Button>
        </div>
      </form>
    </div>
  );
}
