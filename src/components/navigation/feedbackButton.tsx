"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function FeedbackButton() {
  return (
    <>
      <div className="fixed bottom-10 left-10">
        <Button
          onClick={() =>
            (window.location.href = "https://armitage.canny.io/feedback")
          }
          className="bg-lime-500 p-0 w-16 h-16 rounded-full hover:bg-lime-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none"
        >
          <Icons.messagesSquare className="w-6 h-6 inline-block" />
        </Button>
      </div>
    </>
  );
}
