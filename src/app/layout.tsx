import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "@/components/ui/sonner";
import { NextAuthProvider } from "./providers/nextAuthProvider";
import Providers from "./providers/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Armitage",
  description: "Engineering impact data platform",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Providers>
          <NextAuthProvider>
            <div>{children}</div>
            <Analytics />
            <Toaster />
          </NextAuthProvider>
        </Providers>
      </body>
    </html>
  );
}
