import { getConversations, getMessagesWithUser } from "@/actions/messageActions";
import ChatWindow from "@/components/profile/messages/ChatWindow";
import ChatList from "@/components/profile/messages/ChatList";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { auth } from "@/auth";
import db from "@/lib/db";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await auth();
  const user = await db.user.findUnique({ where: { email: session?.user?.email || "" } });
  
  if (!user) return <div>Lütfen giriş yapın.</div>;

  const params = await searchParams;
  const activeUserId = params.uid;

  // Tüm konuşmaları çek (Sol liste için)
  const conversations = await getConversations();

  // Eğer bir kişi seçiliyse, onunla olan mesajları çek (Sağ taraf için)
  let activeMessages = [];
  let activeReceiverName = "";

  if (activeUserId) {
    activeMessages = await getMessagesWithUser(activeUserId);
    const receiver = await db.user.findUnique({ where: { id: activeUserId }, select: { name: true, surname: true } });
    activeReceiverName = `${receiver?.name || ""} ${receiver?.surname || ""}`.trim() || "Kullanıcı";
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <h1 className="text-2xl font-bold text-[#3b5062] mb-4">Mesaj Kutusu</h1>
      
      <Card className="flex-1 flex overflow-hidden border shadow-sm h-full">
        {/* Sol Liste */}
        <div className={`w-full md:w-80 border-r bg-white flex-shrink-0 ${activeUserId ? "hidden md:flex" : "flex"}`}>
            <ChatList conversations={conversations} />
        </div>

        {/* Sağ Sohbet Alanı */}
        <div className={`flex-1 flex flex-col bg-gray-50 ${!activeUserId ? "hidden md:flex" : "flex"}`}>
            {activeUserId ? (
                <ChatWindow 
                    messages={activeMessages} 
                    currentUserId={user.id} 
                    receiverId={activeUserId}
                    receiverName={activeReceiverName}
                />
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                     <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare size={48} className="text-gray-300" />
                     </div>
                     <p className="text-lg font-medium">Sohbet Başlatın</p>
                     <p className="text-sm">Mesajlaşmaya başlamak için soldan bir kişi seçin.</p>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
}