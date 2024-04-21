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
  const [isValid, setIsValid] = useState(true);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignInForm = async () => {
    const valid = validateEmail(email);
    setIsValid(valid);

    if (valid) {
      localStorage.setItem("anonymousUserUid", email);
      setAnonymousUserUid(email);

      const { data } = await axios.post("/api/users", {
        email: email,
      });

      if (data?.id) {
        localStorage.setItem("anonymousUserUid", data.id);
        setAnonymousUserUid(data.id);
      }
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
                style={{
                  border: isValid ? "1px solid black" : "1px solid red",
                }}
              />
              {!isValid && (
                <p style={{ color: "red" }}>
                  Please enter a valid email address
                </p>
              )}
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
