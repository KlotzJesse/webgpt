"use server";
import { Database } from "@/types/database.types";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export default async function deleteSource(formData: FormData) {
  const id = formData.get("id");

  const supabase = createServerActionClient<Database>({ cookies });
  const { error } = await supabase
    .from("sources")
    .delete()
    .eq("id", id as string);

  revalidateTag("sources");

  if (error) {
    return { error };
  }

  return { success: true };
}
