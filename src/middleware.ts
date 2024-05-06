export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/teams",
    "/teams/:teamId*",
    "/gitrepo",
    "/create-team",
    "/overview",
    "/contributor",
    "/settings",
    "/projects/new",
  ],
};
