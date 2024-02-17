import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Team } from "@prisma/client";

interface RepoDropdownProps {
  teams: Team[];
  handleSelectTeam: (team: Team) => void;
}

export function SelectTeamDropdown({
  teams,
  handleSelectTeam,
}: RepoDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? teams.find(
                (team) => team.name.toLowerCase() === value.toLowerCase(),
              )?.name
            : "Select team..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search repository..." />
          <CommandEmpty>No team found.</CommandEmpty>
          <CommandGroup>
            {teams.map((team) => (
              <CommandItem
                key={team.id}
                value={team.name}
                onSelect={(currentValue) => {
                  const selectedTeam = teams.find(
                    (team) =>
                      team.name.toLowerCase() === currentValue.toLowerCase(),
                  );
                  if (selectedTeam) handleSelectTeam(selectedTeam);
                  setValue(
                    currentValue.toLowerCase() === value.toLowerCase()
                      ? ""
                      : currentValue,
                  );
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.toLowerCase() === team.name.toLowerCase()
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {team.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
