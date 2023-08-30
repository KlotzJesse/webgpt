"use server";
import { Database } from "@/types/database.types";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export default async function updateProject(formData: FormData) {
  /*map a data array of the form data*/
  const payload = Array.from(formData.entries()).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as any);

  const supabase = createServerActionClient<Database>({ cookies });
  const { data, error } = await supabase
    .from("projects")
    .update({
      ...payload,
    })
    .eq("id", payload.id);

  revalidateTag("projects");
}
