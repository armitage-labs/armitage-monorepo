import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
            <Toaster />
          </NextAuthProvider>
        </Providers>
      </body>
    </html>
  );
}
