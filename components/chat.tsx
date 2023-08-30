"use client";

import { useChat, type Message } from "ai/react";

import { ChatList } from "@/components/chat-list";
import { ChatPanel } from "@/components/chat-panel";
import { ChatScrollAnchor } from "@/components/chat-scroll-anchor";
import { EmptyScreen } from "@/components/empty-screen";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
}

export interface Source {
  id: string;
  sources: string[];
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const pathName = usePathname();
  //TODO: Pass as prop instead of parsing pathName
  const projectId = pathName.split("/")[2];
  const { messages, append, reload, stop, isLoading, input, setInput, data } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        projectId: projectId,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText);
        }
      },
    });

  return (
    <div className="h-full relative flex flex-col">
      <div className={cn("pb-[200px] pt-4 md:pt-10", className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} data={data ?? []} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />
    </div>
  );
}
