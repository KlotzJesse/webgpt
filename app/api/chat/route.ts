import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import {
  OpenAIStream,
  StreamingTextResponse,
  experimental_StreamData,
} from "ai";
import { oneLine, stripIndent } from "common-tags";
import GPT3Tokenizer from "gpt3-tokenizer";
import { cookies } from "next/headers";
import { Configuration, OpenAIApi, ResponseTypes } from "openai-edge";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const json = await request.json();
  const { messages, projectId } = json;

  // OpenAI recommends replacing newlines with spaces for best results
  const input = messages[messages.length - 1].content.replace(/\n/g, " ");

  // Generate a one-time embedding for the query itself
  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input,
  });

  const embededData =
    (await embeddingResponse.json()) as ResponseTypes["createEmbedding"];

  const [{ embedding }] = embededData.data;

  // Fetching data section chunks
  const { data: documents } = await supabase.rpc("match_data_sections_v3", {
    query_embedding: embedding,
    match_threshold: 0.7, // Threshold of similarity for matches
    match_count: 15, // Number of matches that should return
    project_id: projectId,
  });

  const sortedDocuments = documents.sort((a: any, b: any) => {
    return b.similarity - a.similarity;
  });

  const { data: sourcss } = await supabase
    .from("data")
    .select("*")
    .in(
      "id",
      sortedDocuments.map((document: any) => document.data_id)
    );

  const sources = sourcss ?? [];

  /*sort sourcss by similarity (value from 0 to 1) provided by the related documents identified by id*/
  const sorted = sources.sort((a: any, b: any) => {
    const aSimilarity = sortedDocuments.find(
      (document: any) => document.data_id === a.id
    )?.similarity;
    const bSimilarity = sortedDocuments.find(
      (document: any) => document.data_id === b.id
    )?.similarity;
    return bSimilarity - aSimilarity;
  });

  const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
  let tokenCount = 0;
  let contextText = "";

  // Concat matched documents
  for (let i = 0; i < sortedDocuments.length; i++) {
    const document = sortedDocuments[i];
    const content = document.content;
    const encoded = tokenizer.encode(content);
    tokenCount += encoded.text.length;

    // Limit context to max 1500 tokens (configurable)
    if (tokenCount > 3000) {
      break;
    }

    contextText += `${content.trim()}\n---\n`;
  }

  const prompt = stripIndent`${oneLine`
      You are a very enthusiastic, funny and sympathic Website GUIDE. Your job is to help the user to find the right brands or products. Given the following sections from the
      website, answer the question using only that information,
      outputted in markdown format. If you are unsure and the answer
      is not explicitly written in the documentation, say
      "Sorry, i'm not sure. May you ask it a different way? If not, please try to find it on the website" (add the website url). Try always to directly link to a brand or product page, but only if provided or you will be punished. Also add call to actions that the user can use, but only if provided, if not you will be punished. Keep it short and simple.`}
  
      Context sections:
      ---
      ${contextText}
  
      Question: """
      ${input}
      """
  
      Format your Answer as markdown and in german:
    `;

  const completionResponse = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 512, // Choose the max allowed tokens in completion; so we get short answers
    temperature: 0, // Set to 0 for deterministic results
    stream: true, //Response should be streamed back in chunks, for faster interactions times
  });

  const data = new experimental_StreamData();
  const stream = OpenAIStream(completionResponse, {
    async onCompletion(completion) {
      //TODO: Implement caching of requests and answers, so that the same question is not requested twice to openai
    },
    onFinal(completion: any) {
      data.close();
    },
    experimental_streamData: true,
  });

  data.append({
    sources:
      sorted.map((data: any) => {
        return {
          name: data.name,
          path: data.path,
        };
      }) ?? [],
  });
  return new StreamingTextResponse(stream, {}, data);
}
