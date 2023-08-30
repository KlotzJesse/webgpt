"use server";
import { Database } from "@/types/database.types";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export default async function deleteProject(projectId: string) {
  const supabase = createServerActionClient<Database>({ cookies });
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  revalidateTag("projects");

  if (error) {
    return { error };
  }

  return { success: true };
}
