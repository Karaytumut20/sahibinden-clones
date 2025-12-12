import { Button } from '@/components/ui/button';
import { Phone, User } from 'lucide-react';
import MessageModal from '@/components/modals/MessageModal';

interface SellerSidebarProps {
  sellerName: string;
  sellerId: string; // EKLENDİ: Mesaj için gerekli
  listingId: string; // EKLENDİ
  listingTitle: string; // EKLENDİ
}

export default function SellerSidebar({ sellerName, sellerId, listingId, listingTitle }: SellerSidebarProps) {
  return (
    <div className='border rounded-lg p-4 bg-white shadow-sm sticky top-20'>
      <div className='flex items-center gap-3 mb-4'>
        <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500'>
          <User size={24} />
        </div>
        <div>
          <h4 className='font-bold text-[#3b5062]'>{sellerName}</h4>
          <p className='text-xs text-gray-500'>Hesap Sahibi</p>
        </div>
      </div>
      
      <div className='space-y-2'>
        <Button className='w-full bg-[#3b5062] hover:bg-[#2c3e4e] h-10'>
          <Phone size={16} className='mr-2' />
          05XX XXX XX XX
        </Button>
        
        <MessageModal receiverId={sellerId} listingId={listingId} listingTitle={listingTitle} />
      </div>
    </div>
  );
}