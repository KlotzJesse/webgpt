"use server";
import { Database } from "@/types/database.types";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export default async function addProject(formData: FormData) {
  const name = formData.get("name");
  const teamId = formData.get("teamId");

  const supabase = createServerActionClient<Database>({ cookies });
  const { data, error } = await supabase.from("projects").insert({
    name: name as string,
    team_id: teamId as string,
  });

  revalidateTag("projects");
}
