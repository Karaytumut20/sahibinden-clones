"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatListProps {
  conversations: any[];
}

export default function ChatList({ conversations }: ChatListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeUserId = searchParams.get("uid"); // URL'den seçili kişiyi al

  const handleSelect = (userId: string) => {
    router.push(`/profile/messages?uid=${userId}`);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="p-4 border-b bg-gray-50/50">
        <h2 className="font-bold text-[#3b5062] text-lg">Mesajlar</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
                Henüz bir mesajlaşma başlatmadınız.
            </div>
        ) : (
            conversations.map((conv) => (
            <button
                key={conv.user.id}
                onClick={() => handleSelect(conv.user.id)}
                className={cn(
                "w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-all text-left border-b border-gray-100 last:border-0",
                activeUserId === conv.user.id ? "bg-blue-50 border-l-4 border-l-blue-600" : "border-l-4 border-l-transparent"
                )}
            >
                <Avatar className="h-12 w-12 border">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${conv.user.name}`} />
                    <AvatarFallback><User size={20} /></AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                    <span className="font-semibold text-sm text-gray-900 truncate">{conv.user.name || "Kullanıcı"}</span>
                    <span className="text-[10px] text-gray-400">
                        {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <p className={cn(
                    "text-xs truncate", 
                    activeUserId === conv.user.id ? "text-blue-600 font-medium" : "text-gray-500"
                )}>
                    {conv.listing?.title ? `İlan: ${conv.listing.title.substring(0, 20)}...` : conv.lastMessage.content}
                </p>
                </div>
            </button>
            ))
        )}
      </div>
    </div>
  );
}