"use client";

import deleteDataEntry from "@/app/actions/delete-data";
import { ActionResponse } from "@/types/action.types";
import { useToast } from "../ui/use-toast";

export default function DeleteDataEntryAction({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  async function onCreate(formData: FormData) {
    const res: ActionResponse = (await deleteDataEntry(
      formData
    )) as ActionResponse;
    if (res.error) {
      return toast({
        title: `Entry Delete Error - ${res.error.code}`,
        description: res.error.message,
      });
    }
    if (res.success) {
      return toast({
        title: "Data Entry deleted",
        variant: "destructive",
        description: "Entry has been deleted successfully.",
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
