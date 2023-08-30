"use server";
import { inngest } from "@/lib/inngest-client";
import { Database } from "@/types/database.types";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function fetchSources(formData: FormData) {
  const id = formData.get("sourceId");
  const supabase = createServerActionClient<Database>({ cookies });
  const { data, error } = await supabase
    .from("sources")
    .select("*")
    .eq("id", id as string)
    .single();

  if (error) {
    return { error: error };
  }

  if (!data) {
    return { message: "No sources found" };
  }

  await inngest.send({
    name: "test/hello.world",
    data: {
      ...data,
    },
  });

  return { success: true };
}
