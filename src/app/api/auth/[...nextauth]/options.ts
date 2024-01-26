import type { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const options: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
  },
};
