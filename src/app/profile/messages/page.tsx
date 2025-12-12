import { getConversations } from '@/actions/messageActions';
import ChatWindow from '@/components/profile/messages/ChatWindow';
import { Card } from '@/components/ui/card';
import { User, MessageSquare } from 'lucide-react';

export default async function MessagesPage() {
  const conversations = await getConversations();

  return (
    <div className='h-[600px] flex flex-col'>
      <h1 className='text-2xl font-bold text-[#3b5062] mb-6'>Mesajlarım</h1>
      
      <Card className='flex-1 flex overflow-hidden border shadow-sm'>
        {/* Sol Liste */}
        <div className='w-1/3 border-r bg-gray-50 overflow-y-auto'>
            {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                    Henüz mesajınız yok.
                </div>
            ) : (
                conversations.map((conv: any) => (
                    <div key={conv.user.id} className='p-4 border-b hover:bg-white cursor-pointer transition-colors'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600'>
                                <User size={20} />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <h4 className='font-bold text-sm text-gray-800 truncate'>{conv.user.name || 'Kullanıcı'}</h4>
                                <p className='text-xs text-gray-500 truncate'>{conv.listing?.title || 'İlan hakkında'}</p>
                                <p className='text-xs text-gray-400 mt-1 truncate'>{conv.lastMessage.content}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Sağ Sohbet Alanı (Seçili kullanıcıya göre doldurulacak - Şimdilik placeholder) */}
        <div className='flex-1 flex flex-col items-center justify-center bg-white text-gray-400'>
             <MessageSquare size={48} className="mb-4 opacity-20" />
             <p>Soldan bir konuşma seçin</p>
             <p className="text-xs mt-2 text-blue-600">(Not: Tam sohbet penceresi bir sonraki güncellemede)</p>
        </div>
      </Card>
    </div>
  );
}