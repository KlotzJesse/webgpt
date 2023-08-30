"use client";

import deleteSource from "@/app/actions/delete-source";
import { ActionResponse } from "@/types/action.types";
import { useToast } from "../ui/use-toast";

export default function DeleteSourceAction({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  async function onCreate(formData: FormData) {
    const res: ActionResponse = (await deleteSource(
      formData
    )) as ActionResponse;
    if (res.error) {
      return toast({
        title: `Error - ${res.error.code}`,
        description: res.error.message,
      });
    }
    if (res.success) {
      return toast({
        title: "Source deleted",
        variant: "destructive",
        description: "Source has been deleted successfully.",
      });
    }
  }

  return (
    <form action={onCreate}>
      <input type="hidden" name="id" value={id} />
      {children}
    </form>
  );
}
