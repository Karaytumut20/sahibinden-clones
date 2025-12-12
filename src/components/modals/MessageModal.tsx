'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageCircle } from 'lucide-react';
import { sendMessage } from '@/actions/messageActions';

interface MessageModalProps {
  receiverId?: string;
  listingId?: string;
  listingTitle?: string;
}

export default function MessageModal({ receiverId, listingId, listingTitle }: MessageModalProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if(!receiverId) return alert('Satıcı bilgisi alınamadı.');
    
    setLoading(true);
    const formData = new FormData();
    formData.append('receiverId', receiverId);
    if(listingId) formData.append('listingId', listingId);
    formData.append('content', content);

    const res = await sendMessage(formData);
    setLoading(false);

    if (res.success) {
      alert('Mesajınız iletildi!');
      setOpen(false);
      setContent('');
    } else {
      alert(res.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 h-10">
          <MessageCircle size={16} className="mr-2" />
          Mesaj Gönder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Satıcıya Mesaj Gönder</DialogTitle>
          {listingTitle && <p className="text-sm text-gray-500">İlan: {listingTitle}</p>}
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea 
            placeholder="Mesajınızı buraya yazın..." 
            className="min-h-[120px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button onClick={handleSend} disabled={loading} className="w-full bg-[#3b5062]">
            {loading ? 'Gönderiliyor...' : <><Send size={16} className="mr-2" /> Gönder</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}