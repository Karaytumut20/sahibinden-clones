"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Camera, Maximize2 } from "lucide-react";

export default function ListingGallery() {
  const images = [
    "https://placehold.co/800x600/png?text=Arac+On+Gorunum",
    "https://placehold.co/800x600/png?text=Arac+Yan+Gorunum",
    "https://placehold.co/800x600/png?text=Ic+Mekan",
    "https://placehold.co/800x600/png?text=Motor",
    "https://placehold.co/800x600/png?text=Bagaj",
    "https://placehold.co/800x600/png?text=Gosterge+Paneli",
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-3">
      {/* Büyük Resim Alanı */}
      <div className="relative w-full h-[450px] bg-gray-100 border rounded-lg overflow-hidden group">
        <Image 
          src={selectedImage} 
          alt="İlan Resmi" 
          fill 
          className="object-contain" 
          priority
        />
        
        {/* Resim Üzeri Araçlar */}
        <div className="absolute bottom-4 right-4 flex gap-2">
            <div className="bg-black/50 text-white px-3 py-1 rounded text-xs flex items-center gap-1 backdrop-blur-sm">
                <Camera size={14} />
                <span>1/{images.length}</span>
            </div>
            <button className="bg-black/50 hover:bg-black/70 text-white p-1.5 rounded backdrop-blur-sm transition-colors">
                <Maximize2 size={16} />
            </button>
        </div>
      </div>

      {/* Küçük Resimler (Thumbnails) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={cn(
              "relative w-24 h-20 border-2 rounded-md overflow-hidden flex-shrink-0 cursor-pointer transition-all hover:opacity-100",
              selectedImage === img ? "border-blue-600 opacity-100 ring-2 ring-blue-100" : "border-gray-200 opacity-70 hover:border-gray-300"
            )}
          >
            <Image src={img} alt={"Thumb " + idx} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}