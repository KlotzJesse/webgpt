"use client";
import { type Message } from "ai";

import { ChatMessage } from "@/components/chat-message";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export interface ChatList {
  messages: Message[];
  data: any[];
}

export function ChatList({ messages, data }: ChatList) {
  const [count, setCount] = useState(0);
  if (!messages.length) {
    return null;
  }
  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => {
        return (
          <div key={index}>
            <ChatMessage
              message={message}
              source={
                message.role === "assistant"
                  ? data?.[Math.round(index / 3)] ?? { sources: [] }
                  : { sources: [] }
              }
            />
            {index < messages.length - 1 && <Separator className="my-4 " />}
          </div>
        );
      })}
    </div>
  );
}
