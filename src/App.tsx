import { useEffect, useState } from "react";

import Header from "./components/Header";
import ChatInput from "./components/ChatInput";
import ChatWindow from "./components/ChatWindow";

import type { Chat, Message } from "./types/chat";
import ChatSidebar from "./components/ChatSidebar";

function App() {
  const [initialChat] = useState<Chat>(() => {
    const savedChats = localStorage.getItem("chat-history");

    if (savedChats) {
      const parsedChats: Chat[] = JSON.parse(savedChats);

      const existingNewChat = parsedChats.find(
        (chat) =>
          chat.title === "New Chat" &&
          chat.messages.length === 0
      );

      if (existingNewChat) {
        return existingNewChat;
      }
    }

    return {
      id: `chat-${Date.now()}`,
      title: "New Chat",
      messages: [],
    };
  });
  
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem("chat-history");

    if (savedChats) {
      const parsedChats: Chat[] = JSON.parse(savedChats);

      const existingNewChat = parsedChats.find(
        (chat) =>
          chat.title === "New Chat" &&
          chat.messages.length === 0
      );

      if (existingNewChat) {
        return [
          existingNewChat,
          ...parsedChats.filter(
            (chat) => chat.id !== existingNewChat.id
          ),
        ];
      }

      return [initialChat, ...parsedChats];
    }

    return [initialChat];
  });

  const [activeChatId, setActiveChatId] = useState(
    initialChat.id
  );


  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello! 👋 Ask me anything.",
    },
  ]);
 

  useEffect(() => {
    localStorage.setItem(
      "chat-history",
      JSON.stringify(chats)
    );
  }, [chats]);

  

  const clearChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: "New Chat",
      messages: [],
    }; 

    setChats((prevChats) => [newChat, ...prevChats]);
    setActiveChatId(newChat.id);

    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content: "Hello! 👋 Ask me anything.",
      },
    ]);
  };

  const selectChat = (chatId: string) => {
    const selectedChat = chats.find(
      (chat) => chat.id === chatId
    );

    if (!selectedChat) return;

    setActiveChatId(chatId);
    setMessages(selectedChat.messages);
  };

  const deleteChat = (chatId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this chat?"
    );

    if (!confirmed) return;

    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: "New Chat",
      messages: [],
    };


    setChats((prevChats) => {
      const remainingChats = prevChats.filter(
        (chat) => chat.id !== chatId
      );

      if (chatId === activeChatId) {
        setActiveChatId(newChat.id);
        setMessages([
          {
            id: 1,
            role: "assistant",
            content: "Hello! 👋 Ask me anything.",
          },
        ]);

        return [newChat, ...remainingChats];
      }

      return remainingChats;
    });
  };



  const updateCurrentChat = (updatedMessages: Message[]) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: updatedMessages,
            }
          : chat
      )
    );
  };



  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text,
    };

    setChats((prevChats) =>
    prevChats.map((chat) =>
      chat.id === activeChatId &&
      chat.title === "New Chat"
        ? {
            ...chat,
            title:
              text.length > 30
                ? text.slice(0, 30) + "..."
                : text,
          }
        : chat
    )
    );

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    updateCurrentChat(updatedMessages);
  

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

      const messagesWithAI = [...updatedMessages, aiMessage];

      setMessages(messagesWithAI);
      updateCurrentChat(messagesWithAI);

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, {
          stream: true,
        });     

        aiText += chunk;

        const updatedAIMessage = messagesWithAI.map((message) =>
        message.id === aiMessage.id
        ? {
          ...message,
          content: aiText,
          }
        : message
      );

      setMessages(updatedAIMessage);
      updateCurrentChat(updatedAIMessage);
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

      <div className="flex flex-1">
        <ChatSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
        />

      <div className="flex-1 flex flex-col">
        <ChatWindow messages={messages} />

        <ChatInput
          onSend={sendMessage}
          loading={loading}
    />
  </div>
</div>    
</div>
);
}

export default App;