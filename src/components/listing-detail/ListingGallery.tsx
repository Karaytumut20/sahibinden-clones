'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Camera, Maximize2 } from 'lucide-react';

interface ListingGalleryProps {
  images: string[];
}

export default function ListingGallery({ images }: ListingGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className='flex flex-col gap-3'>
      <div className='relative w-full h-[300px] md:h-[500px] bg-gray-100 border rounded-lg overflow-hidden group'>
        <Image 
          src={selectedImage} 
          alt='İlan Resmi' 
          fill 
          className='object-contain' 
          priority
        />
        
        <div className='absolute bottom-4 right-4 flex gap-2'>
            <div className='bg-black/50 text-white px-3 py-1 rounded text-xs flex items-center gap-1 backdrop-blur-sm'>
                <Camera size={14} />
                <span>{images.indexOf(selectedImage) + 1}/{images.length}</span>
            </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-hide'>
            {images.map((img, idx) => (
            <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={cn(
                'relative w-20 h-16 md:w-24 md:h-20 border-2 rounded-md overflow-hidden flex-shrink-0 cursor-pointer transition-all hover:opacity-100',
                selectedImage === img ? 'border-blue-600 opacity-100 ring-2 ring-blue-100' : 'border-gray-200 opacity-70 hover:border-gray-300'
                )}
            >
                <Image src={img} alt={'Thumb ' + idx} fill className='object-cover' />
            </button>
            ))}
        </div>
      )}
    </div>
  );
}