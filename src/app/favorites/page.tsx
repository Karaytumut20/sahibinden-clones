"use client";

import { useState, useEffect } from "react";
import ListingCard from "@/components/listings/ListingCard";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    // Simüle edilmiş favori verisi
    const mockFavs = [
        { id: 1, title: "Favori İlanım 1", price: "1.250.000 TL", location: "İstanbul", image: "https://placehold.co/300x200?text=Fav1" },
        { id: 2, title: "Favori İlanım 2", price: "3.500 TL", location: "Ankara", image: "https://placehold.co/300x200?text=Fav2" }
    ];
    setFavorites(mockFavs);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <div className="p-2 bg-red-100 rounded-full text-red-600">
            <Heart size={24} fill="currentColor" />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-[#3b5062]">Favori İlanlarım</h1>
            <p className="text-sm text-gray-500">Takip ettiğiniz ilanları buradan görüntüleyebilirsiniz.</p>
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((item) => (
            <div key={item.id} className="relative group">
                <ListingCard 
                    title={item.title} 
                    price={item.price} 
                    location={item.location}
                    image={item.image}
                />
                <button className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-red-600 hover:bg-white transition-colors shadow-sm z-10">
                    <Heart size={16} fill="currentColor" />
                </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
            <h3 className="text-lg font-semibold text-gray-600">Favori İlanınız Yok</h3>
            <p className="text-gray-400 mb-4">Henüz hiç bir ilanı favorilerinize eklemediniz.</p>
            <Link href="/">
                <Button>İlanlara Göz At</Button>
            </Link>
        </div>
      )}
    </div>
  );
}