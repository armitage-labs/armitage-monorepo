import { NavItem } from "@/types";

export const signedInNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/overview",
    icon: "dashboard",
    label: "dashboard",
  },
  {
    title: "Projects",
    href: "/projects",
    icon: "folderGit2",
    label: "projects",
  },
  {
    title: "Contributors",
    href: "/contributors",
    icon: "heartHandshake",
    label: "contributors",
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
