import { inngest } from "@/lib/inngest-client";
import { Database } from "@/types/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { sourceId: string } }
) {
  /*get sourceId from request path*/

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data, error } = await supabase
    .from("sources")
    .select("*")
    .eq("id", params.sourceId)
    .single();

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  await inngest.send({
    name: "test/hello.world",
    data: {
      ...data,
    },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
