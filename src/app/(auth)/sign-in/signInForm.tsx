"use client";

import { UserAuthForm } from "@/components/authentication/user-auth-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SignInForm() {
  const [anonymousUserUid, setAnonymousUserUid] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const handleSignInForm = async () => {
    localStorage.setItem("anonymousUserUid", email);
    setAnonymousUserUid(email);
    const { data } = await axios.post("/api/users", {
      email: email,
    });

    if (data?.id) {
      localStorage.setItem("anonymousUserUid", data.id);
      setAnonymousUserUid(data.id);
    }
  };

  useEffect(() => {
    const storedValue = localStorage.getItem("anonymousUserUid");
    if (storedValue) {
      setAnonymousUserUid(storedValue);
    }
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <Skeleton className="h-12 w-100" />
        </>
      ) : (
        <>
          {anonymousUserUid ? (
            <UserAuthForm />
          ) : (
            <>
              <Input
                type="email"
                placeholder="Email"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
              />
              <Button variant={"secondary"} onClick={() => handleSignInForm()}>
                <>Sign in</>
              </Button>
            </>
          )}
        </>
      )}
    </>
  );
}
