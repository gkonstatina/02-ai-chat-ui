import { useEffect, useState } from "react";

import Header from "./components/Header";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";

import type { Message } from "./types/chat";

function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
  const savedMessages = localStorage.getItem("chat-messages");

  if (savedMessages) {
    return JSON.parse(savedMessages);
  }

  return [
    {
      id: 1,
      role: "assistant",
      content: "Hello! 👋 Ask me anything.",
    },
  ];
});

  useEffect(() => {
    localStorage.setItem(
      "chat-messages",
      JSON.stringify(messages)
    );
  }, [messages]);


  const clearChat = () => {
  localStorage.removeItem("chat-messages");

  setMessages([
    {
      id: Date.now(),
      role: "assistant",
      content: "Hello! 👋 Ask me anything.",
    },
  ]);
};

  


  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
  const userMessage: Message = {
    id: Date.now(),
    role: "user",
    content: text,
  };

  setMessages((prev) => [...prev, userMessage]);

  try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/api/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: text,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response");
    }

    if (!response.body) {
      throw new Error("Response body is empty");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let aiText = "";

    const aiMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, aiMessage]);

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, {
        stream: true,
      });     

      aiText += chunk;

      setMessages((prev) =>
        prev.map((message) =>
          message.id === aiMessage.id
            ? {
              ...message,
              content: aiText,
              }
            : message
        )
      );
    }
  } catch {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 2,
        role: "assistant",
        content: "Unable to connect to backend.",
      },
    ]);
  } finally {
  setLoading(false);
}
}

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col">
     <Header onClear={clearChat} />

      <>
        <ChatWindow messages={messages} />

        {loading && (
          <div className="px-4 pb-4">
            <div className="bg-slate-700 text-white rounded-xl p-3 inline-block">
            🤖 Thinking...
            </div>
          </div>
        )}
      </>




      <ChatInput
        onSend={sendMessage}
        loading={loading}
      />
    </div>
  );
}

export default App;