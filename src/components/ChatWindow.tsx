import { useEffect, useRef } from "react";
import type { Message } from "../types/chat";

interface Props {
  messages: Message[];
}

function ChatWindow({ messages }: Props) {

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === "user"
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] rounded-xl px-4 py-3 ${
              message.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-white"
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;