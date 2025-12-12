'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';
import { toggleFavorite } from '@/actions/userActions';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  listingId: string;
  initialIsFavorited?: boolean;
  className?: string;
}

export default function FavoriteButton({ listingId, initialIsFavorited = false, className }: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link'e tıklamayı engelle
    e.stopPropagation();
    
    setLoading(true);
    // Optimistic update (Hemen renk değiştir)
    setIsFav(!isFav);

    const res = await toggleFavorite(listingId);
    
    if (!res.success) {
      // Hata varsa geri al
      setIsFav(!isFav);
      alert(res.message);
    }
    setLoading(false);
  };

  return (
    <button 
        onClick={handleToggle}
        disabled={loading}
        className={cn('hover:scale-110 transition-transform p-1 rounded-full bg-white/80 hover:bg-white shadow-sm', className)}
    >
      <Heart 
        size={18} 
        className={cn(isFav ? 'fill-red-600 text-red-600' : 'text-gray-500')} 
      />
    </button>
  );
}