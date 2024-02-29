import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Team } from "@prisma/client";

interface TeamCardListProps {
  teamArray: Team[];
}

export function TeamCardList({ teamArray }: TeamCardListProps) {
  return (
    <ScrollArea className="h-72 rounded-md">
      <div className="space-y-8">
        {teamArray.map((team) => (
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback>{team.name[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{team.name}</p>
            </div>
            <div className="ml-auto font-medium">Active</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
