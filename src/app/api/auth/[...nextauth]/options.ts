import type { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
import { GithubUserDto } from "./types/githubUser.dto";
import { synchronizeUser } from "./syncUser";

export const options: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
  },
  callbacks: {
    async jwt({ token, account, profile }): Promise<JWT> {
      if (token) {
        if (account) {
          token.accessToken = account.access_token;
          token.id = account.id;
        }
        if (profile) {
          token.githubLogin = transformProfile(profile)?.login;
        }
        return token;
      }
      return {};
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken?.toString();
        session.githubLogin = token.githubLogin?.toString();
        if (session.user?.email && session.githubLogin) {
          session.userId = await synchronizeUser(
            session.user?.email,
            session.githubLogin,
          );
        }
      }

      return session;
    },
  },
};

export function transformProfile(profile: any): GithubUserDto {
  const stringifiedProfile = JSON.stringify(profile);
  const parsedProfile = JSON.parse(stringifiedProfile) as GithubUserDto;
  return parsedProfile;
}
