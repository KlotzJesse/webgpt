import { Database } from "@/types/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  await supabase.auth.getSession();
  const response = await supabase.from("teams").select("*");

  return NextResponse.json(response, { status: 200 });
}
