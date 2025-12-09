"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Veri
const conversations = [
  { id: 1, name: "Ahmet Yılmaz", lastMessage: "Fiyatta en son ne olur?", date: "10:30", unread: 2 },
  { id: 2, name: "Mehmet Demir", lastMessage: "Yarın gelip görebilir miyim?", date: "Dün", unread: 0 },
  { id: 3, name: "Ayşe Kaya", lastMessage: "Takas düşünüyor musunuz?", date: "2 Gün", unread: 0 },
];

interface ChatListProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function ChatList({ selectedId, onSelect }: ChatListProps) {
  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="p-4 border-b">
        <h2 className="font-bold text-[#3b5062]">Mesajlar</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={cn(
              "w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b last:border-0",
              selectedId === chat.id ? "bg-blue-50 border-l-4 border-l-blue-600" : "border-l-4 border-l-transparent"
            )}
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 text-gray-500">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-sm text-gray-900 truncate">{chat.name}</span>
                <span className="text-xs text-gray-400">{chat.date}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                {chat.unread}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}