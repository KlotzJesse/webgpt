"use server";
import { inngest } from "@/lib/inngest-client";
import { Database } from "@/types/database.types";
import { Source } from "@/types/models.types";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function fetchSources() {
  const supabase = createServerActionClient<Database>({ cookies });
  const { data, error } = await supabase.from("sources").select("*");

  if (error) {
    return { error: error };
  }

  if (!data) {
    return { message: "No sources found" };
  }

  const events = data.map((source: Source) => ({
    name: "test/hello.world",
    data: {
      ...source,
    },
  }));
  await inngest.send(events);

  return { success: true };
}
