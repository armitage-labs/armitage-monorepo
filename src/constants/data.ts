import { NavItem } from "@/types";

export const signedInNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/overview",
    icon: "dashboard",
    label: "dashboard",
  },
  {
    title: "Repositories",
    href: "/repositories",
    icon: "folderGit2",
    label: "repositories",
  },
  {
    title: "Teams",
    href: "/teams",
    icon: "users",
    label: "teams",
  },
  {
    title: "Contributors",
    href: "/contributors",
    icon: "heartHandshake",
    label: "contributors",
  },
  {
    title: "Feedback",
    href: "https://armitage.canny.io/feedback",
    icon: "help",
    label: "help",
  },
];

export const signedOutNavItems: NavItem[] = [
  {
    title: "Login",
    href: "/sign-in",
    icon: "login",
    label: "login",
  },
];
