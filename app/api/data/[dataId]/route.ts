import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { MarkdownTextSplitter } from "langchain/text_splitter";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function GET(
  request: Request,
  { params }: { params: { dataId: string } }
) {
  /*get sourceId from request path*/

  const supabase = createRouteHandlerClient({ cookies });

  const { data, error } = await supabase
    .from("data")
    .select("*")
    .eq("id", params.dataId)
    .single();

  const textSplitter = new MarkdownTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 20,
  });
  const chunks = await textSplitter.splitText(data!.data!);
  const documents = await textSplitter.createDocuments([data!.data!]);

  for (const document of documents) {
    // OpenAI recommends replacing newlines with spaces for best results
    const input = document.pageContent.replace(/\n/g, " ");

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input,
    });
    const [{ embedding }] = response.data;

    const ta = await supabase
      .from("data_sections")
      .delete()
      .eq("data_id", data.id);
    const test = await supabase
      .from("data_sections")
      .insert({ data_id: data.id, content: input, embedding })
      .eq("data_id", params.dataId);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
