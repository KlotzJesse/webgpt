import { inngest } from "@/lib/inngest-client";
import { Database } from "@/types/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  /*get sourceId from request path*/

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data, error } = await supabase.from("data").select("id");

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  await inngest.send({
    name: "app/generate-embeddings",
    data: {
      data,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
