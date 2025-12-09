"use client";

import { useState } from "react";
import ChatList from "@/components/profile/messages/ChatList";
import ChatWindow from "@/components/profile/messages/ChatWindow";

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);

  return (
    <div className="h-[calc(100vh-140px)] border rounded-lg overflow-hidden shadow-sm flex bg-white">
      {/* Sol Liste (Mobilde eğer chat seçiliyse gizle) */}
      <div className={`w-full md:w-80 border-r flex-shrink-0 ${selectedChat ? "hidden md:flex" : "flex"}`}>
        <ChatList selectedId={selectedChat} onSelect={setSelectedChat} />
      </div>

      {/* Sağ Pencere (Mobilde eğer chat seçili değilse gizle) */}
      <div className={`flex-1 flex flex-col ${!selectedChat ? "hidden md:flex" : "flex"}`}>
        {selectedChat ? (
            <div className="flex flex-col h-full relative">
                {/* Mobilde Geri Dön Butonu */}
                <button 
                    onClick={() => setSelectedChat(null)} 
                    className="md:hidden absolute top-4 left-4 z-50 text-gray-500 bg-white/80 p-1 rounded-full shadow-sm"
                >
                    ← Geri
                </button>
                <ChatWindow />
            </div>
        ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
                <div className="text-center">
                    <p>Mesajlaşmaya başlamak için bir sohbet seçin.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}