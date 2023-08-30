import { Message } from "ai";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { ChatMessageActions } from "@/components/chat-message-actions";
import { MemoizedReactMarkdown } from "@/components/markdowns";
import { IconOpenAI, IconUser } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { Key } from "react";
import { ExternalLink } from "./external-link";
import { CodeBlock } from "./ui/codeblock";
import { Separator } from "./ui/separator";

export interface ChatMessageProps {
  message: Message;
  source?: any;
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  return (
    <div className={cn("group relative mb-4  flex items-start ")} {...props}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
          message.role === "user"
            ? "bg-background"
            : "bg-primary text-primary-foreground"
        )}
      >
        {message.role === "user" ? <IconUser /> : <IconOpenAI />}
      </div>
      <div className="flex-1 px-1 ml-4 space-y-2 overflow-hidden mr-8">
        <MemoizedReactMarkdown
          className="prose prose-sm break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
            a({ children, ...props }) {
              return (
                <a className="text-primary" {...props} target="_blank">
                  {children}
                </a>
              );
            },
            code({ node, inline, className, children, ...props }) {
              if (children.length) {
                if (children[0] == "▍") {
                  return (
                    <span className="mt-1 cursor-default animate-pulse">▍</span>
                  );
                }

                children[0] = (children[0] as string).replace("`▍`", "▍");
              }

              const match = /language-(\w+)/.exec(className || "");

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ""}
                  value={String(children).replace(/\n$/, "")}
                  {...props}
                />
              );
            },
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />

        {props.source.sources.length > 0 &&
          !message.content.includes("Sorry,") && (
            <>
              <Separator />

              <div className="text-xs">
                <span className="text-secondary-foreground font-semibold pb-2">
                  Source(s)
                </span>
                {props.source.sources
                  .slice(0, 3)
                  .map((source: { path: string; name: string }, i: Key) => (
                    <ExternalLink
                      key={i}
                      // target="_blank"
                      className=" w-full text-left justify-start"
                      href={source.path}
                    >
                      {source.name.split(" |")[0]}
                    </ExternalLink>
                  ))}
              </div>
            </>
          )}
      </div>
    </div>
  );
}
