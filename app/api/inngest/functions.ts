import { inngest } from "@/lib/inngest-client";
import { createClient } from "@supabase/supabase-js";
import { XMLParser } from "fast-xml-parser";
import { MarkdownTextSplitter } from "langchain/text_splitter";
import { NodeHtmlMarkdown } from "node-html-markdown";
import OpenAI from "openai";
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export const helloWorld = inngest.createFunction(
  { name: "Fetch sources" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sites = await step.run("Fetch sitemap", async () => {
      const request = await fetch(event.data.src);
      const xmlText = await request.text();

      const parser = new XMLParser();

      const xml = parser.parse(xmlText);

      return xml.urlset.url.map((url: any) => url.loc);
    });

    // For each user, send us an event.  Inngest supports batches of events
    // as long as the entire payload is less than 512KB.
    const events = sites.map((site: any) => {
      return {
        name: "app/fetch-website-to-markdown.fetch",
        data: {
          source_id: event.data.id,
          project_id: event.data.project_id,
          url: site,
        },
      };
    });

    // Send all events to Inngest, which triggers any functions listening to
    // the given event names.
    await step.sendEvent(events);

    // Return the number of users triggered.
    return { count: sites.length };
  }
);

export const fetchPage = inngest.createFunction(
  { name: "Fetch data" },
  { event: "app/fetch-website-to-markdown.fetch" },
  async ({ event, step }) => {
    const requestUrl = new URL(event.data.url);
    const html = await step.run("Fetch website text", async () => {
      const res = await fetch(requestUrl.href);
      var html = await res.text();
      const replacedHtml = replaceInternalLinksWithPrefix(
        html,
        requestUrl.origin
      );
      return replacedHtml;
    });

    const markdown = await step.run("Parse to markdown", async () => {
      const ignore = [
        "script",
        "style",
        "img",
        "iframe",
        "picture",
        "footer",
        "nav",
        "header",
      ];

      const nhm = new NodeHtmlMarkdown({
        ignore: ignore,
      });
      ignore?.forEach((el) => {
        nhm.translators.set(el, { ignore: true, recurse: false });
        nhm.codeBlockTranslators.set(el, { ignore: true, recurse: false });
      });
      const markdown = nhm.translate(html);
      return markdown;
    });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const error = await step.run("Save to database", async () => {
      const { error } = await supabase
        .from("data")
        .upsert({
          data: markdown,
          path: requestUrl.href,
          name: getTitle(html),
          source_id: event.data.source_id,
          project_id: event.data.project_id,
        })
        .eq("path", requestUrl.href)
        .eq("source_id", event.data.source_id)
        .eq("project_id", event.data.project_id);
      return error;
    });

    return {
      path: requestUrl.href,
      name: getTitle(html),
    };
  }
);

export const generateEmbeddings = inngest.createFunction(
  { name: "Generate Document Embeddings" },
  { event: "app/generate-embeddings" },
  async ({ event, step }) => {
    // For each user, send us an event.  Inngest supports batches of events
    // as long as the entire payload is less than 512KB.
    const events = event.data.data.map((data: any) => {
      return {
        name: "app/generate-embedding",
        data: {
          ...data,
        },
      };
    });

    // Send all events to Inngest, which triggers any functions listening to
    // the given event names.
    await step.sendEvent(events);

    // const { data, error } = await supabase
    //   .from("data")
    //   .select("*")
    //   .eq("id", event.data.id)
    //   .single();

    // const textSplitter = new MarkdownTextSplitter({
    //   chunkSize: 1000,
    //   chunkOverlap: 20,
    // });
    // const chunks = await textSplitter.splitText(data!.data.join("\n\n"));

    // const error = await step.run("Save to database", async () => {
    //   const { error } = await supabase
    //     .from("data")
    //     .upsert({
    //       data: markdown,
    //       path: requestUrl.href,
    //       name: getTitle(html),
    //       source_id: event.data.source_id,
    //       project_id: event.data.project_id,
    //     })
    //     .eq("path", requestUrl.href)
    //     .eq("source_id", event.data.source_id)
    //     .eq("project_id", event.data.project_id);
    //   return error;
    // });

    return {
      // path: requestUrl.href,
      // name: getTitle(html),
    };
  }
);

export const generateEmbedding = inngest.createFunction(
  { name: "Generate Document Embedding" },
  { event: "app/generate-embedding" },
  async ({ event, step }) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    const ta = await supabase
      .from("data_sections")
      .delete()
      .eq("data_id", event.data.id);

    const { data, error } = await supabase
      .from("data")
      .select("*")
      .eq("id", event.data.id)
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

      const test = await supabase
        .from("data_sections")
        .insert({ data_id: data.id, content: input, embedding })
        .eq("data_id", event.data.id);
    }
  }
);

function replaceInternalLinksWithPrefix(htmlString: string, prefix: string) {
  // Replace all internal links with the prefix.
  return htmlString.replace(
    /((src|href)=")(.*?)"/g,
    (match: string, capture1: string, capture2: string, capture3: string) => {
      if (
        !capture3.startsWith("http") &&
        !capture3.startsWith("mailto") &&
        !capture3.startsWith("tel")
      ) {
        return `${capture1}https://www.krauss-marketplace.com${capture3}"`;
      } else {
        return match;
      }
    }
  );
}

const getTitle = (page: string) =>
  page.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || null;
