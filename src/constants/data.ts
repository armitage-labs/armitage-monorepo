import { NavItem } from "@/types";

export const signedInNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/overview",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Teams",
    href: "/teams",
    icon: "users",
    label: "employee",
  },
  {
    title: "Contributors",
    href: "/contributors",
    icon: "kanban",
    label: "employee",
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
