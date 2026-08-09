import { useEffect, useRef } from "react";
import type { Message as MessageType } from "../types/chat";
import Message from "./Message";
interface Props {
  messages: MessageType[];
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
      <Message
        key={message.id}
        message={message}
    />
  ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;