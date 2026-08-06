import api from "./services/api";
import { useState } from "react";

import Header from "./components/Header";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";

import type { Message } from "./types/chat";

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello! 👋 Ask me anything.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {

  const userMessage: Message = {
    id: Date.now(),
    role: "user",
    content: text,
  };

  setMessages(prev => [...prev, userMessage]);

  setLoading(true);

  try {

    const response = await api.post("/chat", {
      message: text,
    });

    // Temporary delay so we can see the loading indicator
    await new Promise(resolve => setTimeout(resolve, 2000));

    const aiMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: response.data.response,
    };

    setMessages(prev => [...prev, aiMessage]);
    setLoading(false);

  } catch {

    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + 2,
        role: "assistant",
        content: "Unable to connect to backend.",
      },
    ]);
    setLoading(false);

  }

};

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col">
      <Header />

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