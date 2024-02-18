import { NavItem } from "@/types";

export const signedInNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
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
    title: "Profile",
    href: "/create-team",
    icon: "profile",
    label: "profile",
  },
  {
    title: "Info",
    href: "/introduction",
    icon: "kanban",
    label: "kanban",
  },
  {
    title: "Logout",
    href: "/sign-out",
    icon: "close",
    label: "logout",
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
