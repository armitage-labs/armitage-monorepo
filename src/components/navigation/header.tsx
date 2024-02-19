import Link from "next/link";
import ThemeToggle from "../theme/theme-toggle";
import { UserNav } from "./userNavigation";
import { Icons } from "../icons";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link href={"/"}>
            <Icons.armitageBlack className="mr-2 h-12 w-12" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
