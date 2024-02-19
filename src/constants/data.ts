import { NavItem } from "@/types";

export const signedInNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/overview",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "GitRepo",
    href: "/gitrepo",
    icon: "user",
    label: "user",
  },
  {
    title: "Teams",
    href: "/teams",
    icon: "employee",
    label: "employee",
  },
  {
    title: "Create a team",
    href: "/create-team",
    icon: "profile",
    label: "profile",
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
