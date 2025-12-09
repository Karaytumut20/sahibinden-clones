"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ListingGallery() {
  const images = [
    "https://placehold.co/800x600/png?text=Ana+Resim",
    "https://placehold.co/800x600/png?text=Ic+Mekan",
    "https://placehold.co/800x600/png?text=Motor",
    "https://placehold.co/800x600/png?text=Bagaj",
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full h-[400px] bg-gray-100 border rounded-lg overflow-hidden flex items-center justify-center">
        <Image 
          src={selectedImage} 
          alt="İlan Resmi" 
          fill 
          className="object-contain" 
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={cn(
              "relative w-20 h-16 border-2 rounded overflow-hidden flex-shrink-0 cursor-pointer",
              selectedImage === img ? "border-blue-600" : "border-gray-200"
            )}
          >
            <Image src={img} alt={"Thumb " + idx} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}