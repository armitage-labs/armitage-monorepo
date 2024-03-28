import { CalendarDays } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Icons } from "./icons";
import Link from "next/link";

interface HoverExplainerProps {
  title: string;
  description: string;
  subtitle: string;
  imageSrc: string;
}

export function HoverExplainer({
  title,
  description,
  subtitle,
  imageSrc,
}: HoverExplainerProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href="">
          <Icons.help></Icons.help>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={imageSrc} />
            <AvatarFallback>{title[0] + title[1]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-sm">{description}</p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
