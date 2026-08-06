import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
  loading: boolean;
}

function ChatInput({ onSend, loading }: Props) {
  const [message, setMessage] = useState("");

  const send = () => {
    if (!message.trim()) return;

    onSend(message);
    setMessage("");
  };

  return (
    <div className="flex gap-2 p-4 bg-slate-800">
      <input
        className="flex-1 rounded-lg p-3 text-white bg-slate-700 outline-none"
        placeholder="Type a message..."
        value={message}
        disabled={loading}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") send();
        }}
      />

      <button
        onClick={send}
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 px-6 rounded-lg text-white font-bold"
      >
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}

export default ChatInput;