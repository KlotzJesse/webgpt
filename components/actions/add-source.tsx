import * as React from "react";

import addSource from "@/app/actions/add-source";
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

interface AddSourceActionProps {
  projectId: string;
  children?: React.ReactNode;
}

export default function AddSourceAction({
  children,
  projectId,
}: AddSourceActionProps) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent>
          <form action={addSource}>
            <DialogHeader>
              <DialogTitle>Add a new source</DialogTitle>
              <DialogDescription>
                Add a new source to your project.
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <Input
                    type="hidden"
                    id="projectId"
                    name="projectId"
                    value={projectId}
                  />
                  <Label htmlFor="src">Sitemap URL</Label>
                  <Input type="text" id="src" name="src" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit">Continue</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
