"use client";

import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import * as React from "react";

import addTeam from "@/app/actions/add-team";
import setTeam from "@/app/actions/set-current-team";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {
  teams: any;
  teamId: string;
}

export default function TeamSwitcher({
  className,
  teams,
  teamId,
}: TeamSwitcherProps) {
  const pathName = usePathname();
  const router = useRouter();
  const groups = [
    {
      label: "Personal Account",
      teams: [teams[0]],
    },
    {
      label: "Teams",
      teams: [...teams.slice(1, teams.length)],
    },
  ];

  type Team = (typeof groups)[number]["teams"][number];

  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team>(teamId);

  React.useEffect(() => {
    // @ts-ignore
    React.startTransition(() => setTeam(selectedTeam));
    if (selectedTeam && selectedTeam != teamId) router.push(`/dashboard`);
  }, [selectedTeam]);

  const selectedT = teams.find((t: Team) => t.id === selectedTeam);

  return (
    <>
      <div className="w-[0.5px] rotate-[20deg] transform bg-neutral-700 h-[24px] mx-4"></div>
      <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label="Select a team"
              className={cn("w-[200px] justify-between", className)}
            >
              {selectedT.name}
              <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandInput placeholder="Search team..." />
                <CommandEmpty>No team found.</CommandEmpty>
                {groups
                  .filter((group) => group.teams.length > 0)
                  .map((group) => (
                    <CommandGroup key={group.label} heading={group.label}>
                      {group.teams.map((team) => {
                        return (
                          <CommandItem
                            key={team.id}
                            onSelect={() => {
                              setSelectedTeam(team.id);
                              setOpen(false);
                            }}
                            className="text-sm"
                          >
                            {team.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedTeam === team.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  ))}
              </CommandList>
              <CommandSeparator />
              <CommandList>
                <CommandGroup>
                  <DialogTrigger asChild>
                    <CommandItem
                      onSelect={() => {
                        setOpen(false);
                        setShowNewTeamDialog(true);
                      }}
                    >
                      <PlusCircledIcon className="mr-2 h-5 w-5" />
                      Create Team
                    </CommandItem>
                  </DialogTrigger>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <DialogContent>
          <form action={addTeam}>
            <DialogHeader>
              <DialogTitle>Create team</DialogTitle>
              <DialogDescription>
                Add a new team to manage projects.
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Team name</Label>
                  <Input type="text" id="name" name="name" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowNewTeamDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
