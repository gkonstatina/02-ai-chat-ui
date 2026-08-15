import type { Chat } from "../types/chat";

interface Props {
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onDeleteChat,
}: Props) {
  return (
    <aside className="w-64 bg-slate-800 p-4">
      <h2 className="text-white font-bold mb-4">
        Chat History
      </h2>

      <div className="space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center gap-1"
          >
            <button
              onClick={() => onSelectChat(chat.id)}
              className={`flex-1 text-left px-3 py-2 rounded-lg ${
                chat.id === activeChatId
                  ? "bg-slate-600 text-white"
                  : "text-slate-300 hover:bg-slate-700"
              }`}
            >
              {chat.title}
            </button>

            <button
              onClick={() => onDeleteChat(chat.id)}
              className="text-slate-400 hover:text-red-400 px-2"
              title="Delete chat"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default ChatSidebar;