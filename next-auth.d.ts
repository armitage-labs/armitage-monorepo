import "next-auth/jwt";

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's role. */
    userRole?: "admin";
    accessToken?: string;
  }
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    githubLogin?: string;
    userId?: string;
  }
}
