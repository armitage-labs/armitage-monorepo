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
  subtitle?: string;
  imageSrc?: string;
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
          {imageSrc != null && (
            <Avatar>
              <AvatarImage src={imageSrc} />
            </Avatar>
          )}

          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-sm">{description}</p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
