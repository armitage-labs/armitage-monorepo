import type { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
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
  callbacks: {
    async jwt({ token, account, profile }): Promise<JWT> {
      if (account) {
        token.accessToken = account.access_token;
        token.id = account.id;
      }
      if (profile) {
        token.githubLogin = transformProfile(profile);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken?.toString();
        session.githubLogin = token.githubLogin?.toString();
      }

      return session;
    },
  },
};

export function transformProfile(profile: any): string | null {
  const stringifiedProfile = JSON.stringify(profile);
  const parsedProfile = JSON.parse(stringifiedProfile);
  return parsedProfile["login"];
}
