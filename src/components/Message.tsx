import type { Message as MessageType } from "../types/chat";

interface Props {
  message: MessageType;
}

function Message({ message }: Props) {
  return (
    <div
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
  );
}

export default Message;