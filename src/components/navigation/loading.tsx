"use client";

import { useTheme } from "next-themes";
import { Circles } from "react-loader-spinner";

export function LoadingCircle() {
  const { resolvedTheme } = useTheme();

  return (
    <div>
      {resolvedTheme === "dark" ? (
        <Circles color="white" />
      ) : (
        <Circles color="black" />
      )}
    </div>
  );
}
