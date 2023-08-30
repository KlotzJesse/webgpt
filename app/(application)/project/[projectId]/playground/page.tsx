import { Chat } from "@/components/chat";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Database } from "@/types/database.types";
import { Source } from "@/types/models.types";
import { GearIcon } from "@radix-ui/react-icons";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { CodeIcon, GlobeIcon, UploadIcon } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export const dynamic = "force-dynamic";

const prompt = `You are a very enthusiastic company representative who loves
to help people! Given the following sections from the
website, answer the question
using only that information, outputted in Markdown format. If
you are unsure and the answer is not explicitly written in the
documentation, say "{{ I_DONT_KNOW }}".

Context sections:
---
{{ CONTEXT }}

Question: "{{ PROMPT }}"

Answer:`;

export default async function PlaygroundPage({
  params,
}: {
  params: { projectId: string };
}) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });
  const { data: sourcesData, error: sourcesError } = await supabase
    .from("sources")
    .select("*")
    .eq("project_id", params.projectId);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-4 h-[calc(100vh-4rem)] ">
        <div className="h-full flex flex-col justify-between">
          <div className="overflow-y-auto p-6">
            {/* TODO: Implement source connect on playground */}
            <h1 className="relative truncate whitespace-nowrap text-xl font-bold text-foreground-300">
              Connect source
            </h1>
            <p className="mt-2 text-sm font-normal text-foreground">
              Choose your preferred source (soon)
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-1 sm:gap-2">
              <Button
                variant={"outline"}
                className="text-left justify-start"
                disabled
              >
                <GlobeIcon className="w-4 h-4 mr-4 " /> Website
              </Button>
            </div>

            <h2 className="mt-8 text-sm font-semibold text-foreground-300">
              Connected sources
            </h2>
            <div className="mt-4 flex flex-col gap-2">
              {sourcesData?.map((source: Source) => (
                <div
                  key={source.id}
                  className="flex flex-row items-center gap-2 rounded-md bg-sky-100 dark:bg-sky-900/20 py-2 pl-3 pr-2 outline-none"
                >
                  <GlobeIcon className="h-4 w-4 flex-none text-sky-400" />

                  <p className="flex-grow overflow-hidden text-xs text-sky-400">
                    {source.src}
                  </p>
                  {/* TODO: Implement delete / detach button on playground for source */}
                  {/* <button className="button-ring rounded-md p-1 outline-none">
                    <XIcon className="h-3 w-3 text-sky-400" />
                  </button> */}
                </div>
              ))}
              {sourcesData?.length === 0 && (
                <div className="flex h-[110px] w-full items-center justify-center rounded-md border border-dashed text-sm">
                  No sources connected
                </div>
              )}
            </div>
            <Link
              href={`/project/${params.projectId}`}
              className={twMerge(
                buttonVariants({
                  variant: "link",
                }),
                "text-xs mt-4 p-0"
              )}
            >
              Go to data browser
            </Link>
          </div>
          <div className="sticky bg-background bottom-0 z-20 w-full flex flex-col justify-center gap-2 border-t   px-6 py-3 transition duration-300 opacity-100">
            <div className="flex flex-row items-center gap-2">
              <Button variant={"secondary"} className="w-full" disabled>
                Process sources
              </Button>
              <Button variant={"ghost"} disabled>
                <GearIcon />
              </Button>
            </div>
          </div>
        </div>
        <div className="col-span-2 bg-secondary overflow-y-scroll overflow-x-hidden">
          <Chat />
        </div>
        <div className="relative h-full transition">
          <div className="absolute inset-x-0 top-0 bottom-0 flex flex-col overflow-y-auto pb-24">
            <div className="bg-background sticky inset-x-0 top-0 z-10 grid grid-cols-1 items-center justify-end gap-4 border-b  py-4 px-6 sm:grid-cols-2">
              <Button
                variant={"outline"}
                size={"sm"}
                className="w-full"
                disabled
              >
                <UploadIcon className="-ml-0.5 mr-2 h-4 w-4" />
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0"></span>
                <div className="truncate opacity-100">Share</div>
              </Button>

              <Button variant={"outline"} size={"sm"} disabled>
                <CodeIcon className="-ml-0.5 mr-2 h-4 w-4" />

                <span className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0"></span>
                <div className="truncate opacity-100">Get code</div>
              </Button>
            </div>
            <div className="px-6 pt-4 text-foreground-300">
              <h2 className="mb-4 text-lg font-bold">Component</h2>

              <div className="flex flex-col">
                <div className="my-1 items-center grid grid-cols-2 gap-4">
                  <div className="flex flex-row items-center gap-2 py-1 text-sm text-foreground-300">
                    <span className="truncate">Theme</span>
                  </div>
                  <div className="flex w-full justify-end">
                    <Select defaultValue="default">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        {/* TODO: Implement more themes */}
                        {/* <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <h2 className="mb-4 mt-12 text-lg font-bold">Model</h2>
              <div className="flex flex-col">
                <div className="my-1 items-center grid grid-cols-2 gap-4">
                  <div className="flex flex-row items-center gap-2 py-1 text-sm text-foreground-300">
                    <span className="truncate">Model</span>
                  </div>
                  <div className="flex w-full justify-end">
                    <Select defaultValue="gpt-3.5-turbo">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-3.5-turbo">
                          gpt-3.5-turbo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-1 flex w-full flex-col">
                  <Textarea
                    autoComplete="off"
                    disabled
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className="h-[400px] w-full px-2 py-2 text-sm rounded"
                    defaultValue={prompt}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
