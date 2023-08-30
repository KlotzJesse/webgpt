"use client";

import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import * as React from "react";

import addProject from "@/app/actions/add-project";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface ProjectSwitcherProps extends PopoverTriggerProps {
  projects: any;
}

export default function ProjectSwitcher({
  className,
  projects,
}: ProjectSwitcherProps) {
  const groups = [
    {
      label: "Projects",
      teams: [...projects],
    },
  ];

  type Team = (typeof groups)[number]["teams"][number];
  const pathName = usePathname();
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<Team>(
    pathName.includes("project") ? pathName.split("/")[2] : null
  );

  React.useEffect(() => {
    if (selectedTeam && selectedTeam != pathName.split("/")[2])
      router.push(`/project/${selectedTeam}`);
  }, [selectedTeam]);

  React.useEffect(() => {
    setSelectedTeam(
      pathName.includes("project") ? pathName.split("/")[2] : null
    );
  }, [pathName]);

  if (!selectedTeam) return null;

  const foundTeam = projects.find(
    (project: any) => project.id === selectedTeam
  );

  if (!foundTeam) return null;

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
              {foundTeam.name}
              <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandInput placeholder="Search projects..." />
                <CommandEmpty>No project found.</CommandEmpty>
                {groups.map((group) => (
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
                          {/* <Avatar className="mr-2 h-5 w-5">
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${value}.png`}
                            alt={team.name}
                            className="grayscale"
                          />
                          <AvatarFallback>JK</AvatarFallback>
                        </Avatar> */}
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
                      Create Project
                    </CommandItem>
                  </DialogTrigger>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <DialogContent>
          <form action={addProject}>
            <input
              type="hidden"
              name="teamId"
              value={
                projects.find((project: any) => project.id === selectedTeam)
                  .team_id
              }
            />
            <DialogHeader>
              <DialogTitle>Create project</DialogTitle>
              <DialogDescription>
                Add a new project to your current team.
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project name</Label>
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
