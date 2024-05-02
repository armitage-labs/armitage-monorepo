"use client";

import { Button } from "@/components/ui/button";
import React from "react";

function OnboardingTutorial() {
  return (
    <div className="container max-w-none flex h-full w-full flex-col items-center justify-center gap-12 bg-default-background pt-12 pb-12">
      <img
        className="h-8 w-8 flex-none"
        src="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/y2rsnhq3mex4auk54aye.png"
      />
      <div className="flex w-full max-w-[576px] flex-col items-center gap-2">
        <span className="text-heading-1 font-heading-1 text-default-font text-center">
          Unlock the power of integrations
        </span>
        <span className="text-heading-3 font-heading-3 text-neutral-400 text-center">
          By connecting your existing networks and platforms with ours,
          you&#39;re paving the way for an uninterrupted workflow.{" "}
        </span>
      </div>
      <img
        className="max-h-[768px] w-full max-w-[768px] flex-none"
        src="https://res.cloudinary.com/subframe/image/upload/v1711417515/shared/cdnbniyuqjnplaj2zbjw.png"
      />
      <div className="flex items-center justify-center gap-4">
        <Button disabled={false}>Back</Button>
        <Button disabled={false}>Next</Button>
      </div>
      <div className="flex items-start">
        <div className="flex flex-col items-start pt-1 pr-1 pb-1 pl-1">
          <div className="flex h-2 w-2 flex-none flex-col items-start gap-2 rounded-full bg-neutral-200" />
        </div>
        <div className="flex flex-col items-start pt-1 pr-1 pb-1 pl-1">
          <div className="flex h-2 w-2 flex-none flex-col items-start gap-2 rounded-full bg-neutral-400" />
        </div>
        <div className="flex flex-col items-start pt-1 pr-1 pb-1 pl-1">
          <div className="flex h-2 w-2 flex-none flex-col items-start gap-2 rounded-full bg-neutral-200" />
        </div>
        <div className="flex flex-col items-start pt-1 pr-1 pb-1 pl-1">
          <div className="flex h-2 w-2 flex-none flex-col items-start gap-2 rounded-full bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}

export default OnboardingTutorial;
