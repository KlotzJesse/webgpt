import { Database } from "@/types/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NodeHtmlMarkdown } from "node-html-markdown";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(
    "https://www.krauss-marketplace.com/blog/hygienetrends-in-der-hotelbranche-die-neuesten-trends-und-technologien-in-der-hotelhygiene"
  );
  // const projectId = requestUrl.searchParams.get("projectId");

  const supabase = createRouteHandlerClient<Database>({ cookies });
  const res = await fetch(requestUrl.href);
  var html = await res.text();
  /*make a regexp  that prefix all links with https://www.krauss-marketplace.com/ */
  const a = replaceInternalLinksWithPrefix(html, requestUrl.origin);

  const test = NodeHtmlMarkdown.translate(a, {
    ignore: ["script", "style", "img", "iframe", "picture"],
  });

  const { error } = await supabase.from("data").insert({
    data: test,
    path: requestUrl.href,
    name: getTitle(html),
  });

  if (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

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
