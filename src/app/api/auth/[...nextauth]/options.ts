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
          scope: "read:user user:email read:org",
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
          token.expires_at = account.expires_at;
          token.refresh_token = account.refresh_token;
          token.refresh_token_expires_in = account.refresh_token_expires_in;
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
        // @ts-expect-error expiry doesn't exist on token type by default, therefore it complains about types
        if (token.expires_at < Date.now() / 1000 || token.error || token.expires_at === undefined) {
          session.error = "RefreshAccessTokenError";
          return session;
        }
        if (!(session.accessToken && session.githubLogin)) {
          session.accessToken = token.accessToken?.toString();
          session.githubLogin = token.githubLogin?.toString();
        }
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
