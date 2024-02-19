export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/teams", "/gitrepo", "/create-team", "/overview"],
};
