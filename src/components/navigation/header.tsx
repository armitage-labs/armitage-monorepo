"use client";

import Link from "next/link";
import { UserNav } from "./userNavigation";
import { Icons } from "../icons";
import ThemeToggle from "../theme/theme-toggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Header() {
  const { resolvedTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string>();

  useEffect(() => {
    if (resolvedTheme) {
      setSelectedTheme(resolvedTheme);
    }
  }, [resolvedTheme]);
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:block">
          {!selectedTheme ? (
            <div></div>
          ) : (
            <Link href={"/"}>
              {selectedTheme === "dark" ? (
                <Icons.armitageWhite className="mr-2 h-12 w-12" />
              ) : (
                <Icons.armitageBlack className="mr-2 h-12 w-12" />
              )}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <UserNav />
          <ThemeToggle></ThemeToggle>
        </div>
      </nav>
    </div>
  );
}
