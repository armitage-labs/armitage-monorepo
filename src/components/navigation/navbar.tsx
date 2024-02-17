"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Github Repository",
    href: "/gitrepo",
    description: "Register and manage Github Repositories on your account.",
  },
  {
    title: "Teams",
    href: "/teams",
    description: "Manage teams and their contributions.",
  },
  {
    title: "Create a Team",
    href: "/create-team",
    description: "Create a new team to assign repositories.",
  },
  {
    title: "Calculate",
    href: "/calculate",
    description: "Generate calculations for teams.",
  },
];

export function Navbar({ session }: { session: Session | null }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Armitage
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Measure, incentivise and govern open source software
                      contributions programmatically
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/introduction" title="Introduction">
                Understand how Armitage and Sourcecred works.
              </ListItem>
              <ListItem href="/docs/installation" title="Contribute">
                Armitage is a meta app, and you can earn money contributing.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Roadmap">
                Armitage vision, mission and future features.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Scores</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Documentation
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {!session ? (
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              onClick={() => signIn("github", { callbackUrl: "/" })}
            >
              Sign-In
            </NavigationMenuLink>
          </NavigationMenuItem>
        ) : (
          <>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign-out
              </NavigationMenuLink>
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
