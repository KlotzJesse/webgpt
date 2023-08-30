"use client";
import * as React from "react";

import addProject from "@/app/actions/add-project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface AddProjectActionProps {
  teamId: string;
  children?: React.ReactNode;
}

export default function AddProjectAction({
  children,
  teamId,
}: AddProjectActionProps) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent>
          <form action={addProject}>
            <input type="hidden" name="teamId" value={teamId} />
            <DialogHeader>
              <DialogTitle>Add a new project</DialogTitle>
              <DialogDescription>
                Add a new project to your team.
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input type="text" id="name" name="name" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit">Create project</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
