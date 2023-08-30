"use server";
import { Database } from "@/types/database.types";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export default async function addSource(formData: FormData) {
  const src = formData.get("src");
  const projectId = formData.get("projectId");

  const supabase = createServerActionClient<Database>({ cookies });
  const { data, error } = await supabase.from("sources").insert({
    src: src as string,
    project_id: projectId as string,
  });

  revalidateTag("sources");

  if (error) {
    return { error: error };
  }
  if (!data) {
    return { message: "No sources found" };
  }

  return { success: true };
}
