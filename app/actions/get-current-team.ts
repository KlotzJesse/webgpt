"use server";
import { Database } from "@/types/database.types";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function getCurrentTeam() {
  const supabase = createServerActionClient<Database>({ cookies });
  var result = cookies().get("teamId")?.value ?? undefined;
  if (!result) {
    const { data, error: teamError } = await supabase.from("teams").select("*");
    result = data?.[0].id ?? undefined;
  }
  return result;
}
