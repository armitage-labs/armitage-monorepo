"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Icons } from "../icons";
import { useTheme } from "next-themes";

interface OnboardingTutorialProps {
  onTutorialCompleted: (completed: boolean) => void;
}

export default function OnboardingTutorial({
  onTutorialCompleted,
}: OnboardingTutorialProps) {
  const { resolvedTheme } = useTheme();

  const [selectedTheme, setSelectedTheme] = useState<string>();
  const [step, setStep] = useState<number>(0);

  const renderTitleStep = (step: number): string => {
    switch (step) {
      case 0:
        return "Creating a payment address";
      case 1:
        return "What can you use them for";
      case 2:
        return "How to configure them";
      case 3:
        return "Who controls this address?";
      default:
        return "";
    }
  };

  const renderContentStep = (step: number): string => {
    switch (step) {
      case 0:
        return "Creating a payment address allows your project to receive payments from your customers, donations grants and any other form of payment.";
      case 1:
        return "When receiving payments on a project payment address, all funds are automatically distributed to the contributors based on their scores.";
      case 2:
        return "You can configure splits automatically based on Armitage scores, or manually add new receipients and change current percentages.";
      case 3:
        return "No one! This is a smart contract that can only distribute funds based on the rules you set, no entity has custody of these funds.";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (resolvedTheme) {
      setSelectedTheme(resolvedTheme);
    }
  }, [resolvedTheme]);

  useEffect(() => {
    if (step == 4) {
      onTutorialCompleted(true);
    }
  }, [step]);

  return (
    <div className="container max-w-none flex h-full w-full flex-col items-center justify-center gap-12 bg-default-background pt-12 pb-12">
      {!selectedTheme ? (
        <div></div>
      ) : (
        <div>
          {selectedTheme === "dark" ? (
            <Icons.armitageWhite className="h-20 w-20 flex-none"></Icons.armitageWhite>
          ) : (
            <Icons.armitageBlack className="h-20 w-20 flex-none"></Icons.armitageBlack>
          )}
        </div>
      )}
      <div>
        <div className="flex w-full max-w-[576px] flex-col items-center gap-2">
          <span className="text-heading-1 font-heading-1 text-default-font text-center">
            {renderTitleStep(step)}
          </span>
          <span className="text-heading-3 font-heading-3 text-neutral-400 text-center">
            {renderContentStep(step)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Button
          disabled={step == 0}
          variant={"outline"}
          onClick={() => {
            setStep(step - 1);
          }}
        >
          Back
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            setStep(step + 1);
          }}
        >
          Next
        </Button>
      </div>
      <div className="flex items-start">
        <div className="flex flex-col items-start pt-1 pr-1 pb-1 pl-1">
          <div
            className={
              "flex h-2 w-2 flex-none flex-col items-start gap-2 rounded-full " +
              (step == 0 ? "bg-neutral-400" : "bg-neutral-200")
            }
          />
        </div>
        <div className="flex flex-col items-start pt-1 pr-1 pb-1 pl-1">
          <div
            className={
              "flex h-2 w-2 flex-none flex-col items-start gap-2 rounded-full " +
              (step == 1 ? "bg-neutral-400" : "bg-neutral-200")
            }
          />
        </div>
        <div className="flex flex-col items-start pt-1 pr-1 pb-1 pl-1">
          <div
            className={
              "flex h-2 w-2 flex-none flex-col items-start gap-2 rounded-full " +
              (step == 2 ? "bg-neutral-400" : "bg-neutral-200")
            }
          />
        </div>
        <div className="flex flex-col items-start pt-1 pr-1 pb-1 pl-1">
          <div
            className={
              "flex h-2 w-2 flex-none flex-col items-start gap-2 rounded-full " +
              (step == 3 ? "bg-neutral-400" : "bg-neutral-200")
            }
          />
        </div>
      </div>
    </div>
  );
}
