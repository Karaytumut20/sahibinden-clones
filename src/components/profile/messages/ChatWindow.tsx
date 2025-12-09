"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MoreVertical, Phone } from "lucide-react";

// Mock Mesaj Verisi
const initialMessages = [
  { id: 1, text: "Merhaba, ilanınızla ilgileniyorum. Hala satılık mı?", sender: "me", time: "10:00" },
  { id: 2, text: "Evet, satılık. Buyurun.", sender: "other", time: "10:05" },
  { id: 3, text: "Fiyatta pazarlık payı var mı?", sender: "me", time: "10:06" },
  { id: 4, text: "Araç başında cüzi bir miktar olabilir.", sender: "other", time: "10:10" },
];

export default function ChatWindow() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: messages.length + 1,
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Üst Bar */}
      <div className="p-4 bg-white border-b flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
            <div className="font-bold text-[#3b5062]">Ahmet Yılmaz</div>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">• Çevrimiçi</span>
        </div>
        <div className="flex gap-2 text-gray-500">
            <button className="p-2 hover:bg-gray-100 rounded-full"><Phone size={18} /></button>
            <button className="p-2 hover:bg-gray-100 rounded-full"><MoreVertical size={18} /></button>
        </div>
      </div>

      {/* Mesaj Alanı */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div 
                className={`max-w-[75%] px-4 py-2 rounded-lg text-sm shadow-sm 
                ${msg.sender === "me" ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none border"}`}
            >
              <p>{msg.text}</p>
              <span className={`text-[10px] block text-right mt-1 ${msg.sender === "me" ? "text-blue-100" : "text-gray-400"}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mesaj Yazma Alanı */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Bir mesaj yazın..." 
            className="flex-1 focus-visible:ring-blue-600"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}