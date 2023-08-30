"use server";
import { Database } from "@/types/database.types";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export default async function addTeam(formData: FormData) {
  const name = formData.get("name");

  const supabase = createServerActionClient<Database>({ cookies });
  const { data, error } = await supabase.from("teams").insert({
    name: name as string,
  });

  revalidateTag("teams");
}
