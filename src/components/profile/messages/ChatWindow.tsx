"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Phone, MoreVertical, User } from "lucide-react";
import { sendMessage } from "@/actions/messageActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
}

interface ChatWindowProps {
  messages: Message[];
  currentUserId: string;
  receiverId: string;
  receiverName: string;
}

export default function ChatWindow({ messages: initialMessages, currentUserId, receiverId, receiverName }: ChatWindowProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mesaj gelince en alta kaydır
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Optimistic Update (Hemen ekranda göster)
    const tempMsg = {
        id: Date.now().toString(),
        content: newMessage,
        senderId: currentUserId,
        createdAt: new Date()
    };
    setMessages([...messages, tempMsg]);
    setNewMessage("");
    setLoading(true);

    const formData = new FormData();
    formData.append("content", tempMsg.content);
    formData.append("receiverId", receiverId);

    await sendMessage(formData);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#efe7dd] relative"> {/* WhatsApp benzeri arka plan rengi */}
      
      {/* Üst Bar */}
      <div className="p-3 bg-white border-b flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${receiverName}`} />
                <AvatarFallback>{receiverName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <div className="font-bold text-[#3b5062]">{receiverName}</div>
                <span className="text-xs text-green-600 font-medium">Çevrimiçi</span>
            </div>
        </div>
        <div className="flex gap-1 text-gray-500">
            <Button variant="ghost" size="icon"><Phone size={20} /></Button>
            <Button variant="ghost" size="icon"><MoreVertical size={20} /></Button>
        </div>
      </div>

      {/* Mesaj Alanı */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2" ref={scrollRef}>
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div 
                  className={`max-w-[75%] px-3 py-2 rounded-lg text-sm shadow-sm relative group
                  ${isMe ? "bg-[#d9fdd3] text-gray-800 rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none"}`}
              >
                <p className="mr-8">{msg.content}</p> {/* Saat için boşluk */}
                <span className="text-[10px] text-gray-500 absolute bottom-1 right-2 flex items-center gap-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mesaj Yazma Alanı */}
      <div className="p-3 bg-white border-t">
        <form onSubmit={handleSend} className="flex gap-2 items-center">
          <Input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Bir mesaj yazın..." 
            className="flex-1 bg-gray-100 border-none focus-visible:ring-1 focus-visible:ring-blue-600 rounded-full px-4 h-10"
          />
          <Button 
            type="submit" 
            size="icon"
            className="bg-[#3b5062] hover:bg-[#2c3e4e] rounded-full h-10 w-10 flex-shrink-0"
            disabled={loading}
          >
            <Send size={18} className={loading ? "opacity-50" : ""} />
          </Button>
        </form>
      </div>
    </div>
  );
}